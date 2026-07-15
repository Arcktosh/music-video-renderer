import {
  getStaticFiles,
  reevaluateComposition,
  saveDefaultProps,
  type StaticFile,
  watchPublicFolder,
  writeStaticFile,
} from '@remotion/studio';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useRemotionEnvironment, useVideoConfig} from 'remotion';
import {
  ACTIVE_TRACK_MANIFEST,
  ACTIVE_TRACK_TOKEN,
  AUDIO_FILE_EXTENSIONS,
  isAudioAsset,
  readActiveTrackManifest,
} from '../utils/audio-track';

const AUDIO_EXTENSIONS = new Set<string>(AUDIO_FILE_EXTENSIONS);

const formatBytes = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const basename = (path: string) => path.split('/').pop() || path;

const sanitizeFilename = (filename: string) => {
  const dotIndex = filename.lastIndexOf('.');
  const rawStem = dotIndex === -1 ? filename : filename.slice(0, dotIndex);
  const rawExtension = dotIndex === -1 ? '' : filename.slice(dotIndex + 1);
  const stem = rawStem
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
  const extension = rawExtension.toLowerCase().replace(/[^a-z0-9]/g, '');

  return `${stem || 'track'}${extension ? `.${extension}` : ''}`;
};

const getUniqueTrackPath = (filename: string, files: StaticFile[]) => {
  const safeName = sanitizeFilename(filename);
  const dotIndex = safeName.lastIndexOf('.');
  const stem = dotIndex === -1 ? safeName : safeName.slice(0, dotIndex);
  const extension = dotIndex === -1 ? '' : safeName.slice(dotIndex);
  const usedNames = new Set(files.map((file) => file.name.toLowerCase()));

  let candidate = `assets/tracks/${safeName}`;
  let index = 2;

  while (usedNames.has(candidate.toLowerCase())) {
    candidate = `assets/tracks/${stem}-${index}${extension}`;
    index += 1;
  }

  return candidate;
};

const manifestContents = (audioFile: string) =>
  `${JSON.stringify({audioFile}, null, 2)}\n`;

type AudioAssetDockProps = {
  activeAudioFile: string;
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  mutedTextColor: string;
  initiallyOpen?: boolean;
  bindCurrentComposition?: boolean;
};

export const AudioAssetDock: React.FC<AudioAssetDockProps> = ({
  activeAudioFile,
  backgroundColor,
  accentColor,
  textColor,
  mutedTextColor,
  initiallyOpen = false,
  bindCurrentComposition = true,
}) => {
  const {isStudio, isReadOnlyStudio} = useRemotionEnvironment();
  const {id: compositionId, defaultProps} = useVideoConfig();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [isDragging, setIsDragging] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [selectedAudioFile, setSelectedAudioFile] = useState(activeAudioFile);
  const [files, setFiles] = useState<StaticFile[]>(() =>
    isStudio && !isReadOnlyStudio ? getStaticFiles() : [],
  );

  useEffect(() => {
    let cancelled = false;

    if (!isStudio || isReadOnlyStudio) {
      return undefined;
    }

    if (activeAudioFile !== ACTIVE_TRACK_TOKEN) {
      setSelectedAudioFile(activeAudioFile);
      return undefined;
    }

    void readActiveTrackManifest()
      .then(({audioFile}) => {
        if (!cancelled) {
          setSelectedAudioFile(audioFile);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setStatus(
            error instanceof Error
              ? error.message
              : 'Could not read the active-track manifest.',
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeAudioFile, isReadOnlyStudio, isStudio]);

  useEffect(() => {
    if (!isStudio || isReadOnlyStudio) {
      return undefined;
    }

    setFiles(getStaticFiles());
    const watcher = watchPublicFolder((nextFiles) => {
      setFiles(nextFiles);
    });

    return watcher.cancel;
  }, [isReadOnlyStudio, isStudio]);

  const audioFiles = useMemo(
    () =>
      files
        .filter((file) => isAudioAsset(file.name))
        .sort((a, b) => {
          const aPreferred = a.name.startsWith('assets/tracks/') ? 0 : 1;
          const bPreferred = b.name.startsWith('assets/tracks/') ? 0 : 1;
          return (
            aPreferred - bPreferred ||
            b.lastModified - a.lastModified ||
            a.name.localeCompare(b.name)
          );
        }),
    [files],
  );

  const selectTrack = useCallback(
    async (filePath: string) => {
      setIsBusy(true);
      setStatus(`Adding ${basename(filePath)} to the timeline…`);

      try {
        await writeStaticFile({
          filePath: ACTIVE_TRACK_MANIFEST,
          contents: manifestContents(filePath),
        });

        if (
          bindCurrentComposition &&
          defaultProps.audioFile !== ACTIVE_TRACK_TOKEN
        ) {
          await saveDefaultProps({
            compositionId,
            defaultProps: ({savedDefaultProps}) => ({
              ...savedDefaultProps,
              audioFile: ACTIVE_TRACK_TOKEN,
              audioStartSeconds: 0,
              audioEndTrimSeconds: 0,
            }),
          });
        }

        setSelectedAudioFile(filePath);
        reevaluateComposition();
        setStatus('Track added. The composition and timeline now match its duration.');
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'Could not add the track.');
      } finally {
        setIsBusy(false);
      }
    },
    [bindCurrentComposition, compositionId, defaultProps.audioFile],
  );

  const uploadTrack = useCallback(
    async (file: File) => {
      const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
      if (!file.type.startsWith('audio/') && !AUDIO_EXTENSIONS.has(extension)) {
        setStatus('Choose an audio file such as MP3, WAV, M4A, AAC, FLAC, OGG, or Opus.');
        return;
      }

      setIsBusy(true);
      const filePath = getUniqueTrackPath(file.name, files);
      setStatus(`Importing ${file.name}…`);

      try {
        await writeStaticFile({
          filePath,
          contents: await file.arrayBuffer(),
        });
        await selectTrack(filePath);
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'Could not import the audio asset.');
        setIsBusy(false);
      }
    },
    [files, selectTrack],
  );

  if (!isStudio || isReadOnlyStudio) {
    return null;
  }

  return (
    <div
      onPointerDown={(event) => event.stopPropagation()}
      style={{
        position: 'absolute',
        zIndex: 1_000_000,
        top: 24,
        right: 24,
        width: isOpen ? 390 : 'auto',
        maxHeight: 'calc(100% - 48px)',
        color: textColor,
        fontFamily: 'Inter, Avenir Next, Helvetica Neue, Arial, sans-serif',
        fontSize: 14,
        lineHeight: 1.35,
        pointerEvents: 'auto',
      }}
    >
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            border: `1px solid color-mix(in srgb, ${textColor} 24%, transparent)`,
            borderRadius: 999,
            padding: '12px 17px',
            background: `color-mix(in srgb, ${backgroundColor} 88%, transparent)`,
            color: textColor,
            font: 'inherit',
            fontWeight: 850,
            letterSpacing: 1.1,
            cursor: 'pointer',
            boxShadow: '0 12px 38px rgba(0,0,0,0.34)',
            backdropFilter: 'blur(18px)',
          }}
        >
          ♫ AUDIO ASSETS
        </button>
      ) : (
        <div
          style={{
            overflow: 'hidden',
            border: `1px solid color-mix(in srgb, ${textColor} 20%, transparent)`,
            borderRadius: 20,
            background: `color-mix(in srgb, ${backgroundColor} 93%, transparent)`,
            boxShadow: '0 28px 90px rgba(0,0,0,0.48)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              padding: '17px 18px 14px',
              borderBottom: `1px solid color-mix(in srgb, ${textColor} 12%, transparent)`,
            }}
          >
            <div>
              <div style={{fontSize: 12, fontWeight: 900, letterSpacing: 1.8}}>
                AUDIO ASSETS
              </div>
              <div
                style={{
                  marginTop: 4,
                  maxWidth: 290,
                  overflow: 'hidden',
                  color: mutedTextColor,
                  fontSize: 11,
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                Active: {selectedAudioFile}
              </div>
            </div>
            <button
              type="button"
              aria-label="Close audio assets"
              onClick={() => setIsOpen(false)}
              style={{
                width: 32,
                height: 32,
                border: 0,
                borderRadius: 10,
                background: `color-mix(in srgb, ${textColor} 10%, transparent)`,
                color: textColor,
                font: 'inherit',
                fontSize: 18,
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>

          <div style={{padding: 16}}>
            <div
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                const file = event.dataTransfer.files[0];
                if (file) {
                  void uploadTrack(file);
                }
              }}
              style={{
                padding: '18px 16px',
                border: `1.5px dashed color-mix(in srgb, ${isDragging ? accentColor : textColor} ${
                  isDragging ? 72 : 24
                }%, transparent)`,
                borderRadius: 14,
                background: `color-mix(in srgb, ${accentColor} ${isDragging ? 14 : 5}%, transparent)`,
                textAlign: 'center',
              }}
            >
              <div style={{fontWeight: 850}}>Drop an audio file here</div>
              <div style={{marginTop: 4, color: mutedTextColor, fontSize: 11}}>
                It is copied to public/assets/tracks and placed at frame 0.
              </div>
              <button
                type="button"
                disabled={isBusy}
                onClick={() => inputRef.current?.click()}
                style={{
                  marginTop: 12,
                  border: 0,
                  borderRadius: 10,
                  padding: '9px 13px',
                  background: accentColor,
                  color: backgroundColor,
                  font: 'inherit',
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: isBusy ? 'wait' : 'pointer',
                  opacity: isBusy ? 0.58 : 1,
                }}
              >
                IMPORT TRACK
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="audio/*,.aac,.flac,.m4a,.mp3,.oga,.ogg,.opus,.wav,.webm"
                disabled={isBusy}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = '';
                  if (file) {
                    void uploadTrack(file);
                  }
                }}
                style={{display: 'none'}}
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 16,
                marginBottom: 9,
              }}
            >
              <span style={{fontSize: 11, fontWeight: 900, letterSpacing: 1.5}}>
                AVAILABLE TRACKS
              </span>
              <button
                type="button"
                disabled={isBusy}
                onClick={() => {
                  reevaluateComposition();
                  setStatus('Track metadata refreshed.');
                }}
                style={{
                  border: 0,
                  padding: 0,
                  background: 'transparent',
                  color: mutedTextColor,
                  font: 'inherit',
                  fontSize: 10,
                  fontWeight: 800,
                  cursor: isBusy ? 'wait' : 'pointer',
                }}
              >
                REFRESH LENGTH
              </button>
            </div>

            <div
              style={{
                maxHeight: 230,
                overflowY: 'auto',
                border: `1px solid color-mix(in srgb, ${textColor} 10%, transparent)`,
                borderRadius: 12,
              }}
            >
              {audioFiles.length === 0 ? (
                <div style={{padding: 15, color: mutedTextColor, fontSize: 11}}>
                  No audio files found in public/. Import one above.
                </div>
              ) : (
                audioFiles.map((file) => {
                  const active = file.name === selectedAudioFile;
                  return (
                    <button
                      key={file.name}
                      type="button"
                      disabled={isBusy || active}
                      onClick={() => void selectTrack(file.name)}
                      style={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        border: 0,
                        borderBottom: `1px solid color-mix(in srgb, ${textColor} 8%, transparent)`,
                        padding: '11px 12px',
                        background: active
                          ? `color-mix(in srgb, ${accentColor} 16%, transparent)`
                          : 'transparent',
                        color: textColor,
                        font: 'inherit',
                        textAlign: 'left',
                        cursor: active ? 'default' : isBusy ? 'wait' : 'pointer',
                      }}
                    >
                      <span style={{minWidth: 0}}>
                        <span
                          style={{
                            display: 'block',
                            overflow: 'hidden',
                            fontSize: 11,
                            fontWeight: active ? 900 : 750,
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {active ? '● ' : ''}
                          {basename(file.name)}
                        </span>
                        <span
                          style={{
                            display: 'block',
                            marginTop: 2,
                            overflow: 'hidden',
                            color: mutedTextColor,
                            fontSize: 9,
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {file.name}
                        </span>
                      </span>
                      <span
                        style={{
                          display: 'flex',
                          flexShrink: 0,
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: 2,
                        }}
                      >
                        <span
                          style={{
                            color: active ? accentColor : textColor,
                            fontSize: 9,
                            fontWeight: 900,
                            letterSpacing: 0.7,
                          }}
                        >
                          {active ? 'IN TIMELINE' : 'ADD TO TIMELINE'}
                        </span>
                        <span
                          style={{
                            color: mutedTextColor,
                            fontSize: 9,
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {formatBytes(file.sizeInBytes)}
                        </span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <div
              style={{
                minHeight: 28,
                marginTop: 10,
                color: status.toLowerCase().includes('could not') ? '#ff9aa9' : mutedTextColor,
                fontSize: 10,
              }}
            >
              {status || 'Selecting a track recalculates the composition duration automatically.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
