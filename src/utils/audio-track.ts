import {resolveAsset} from './assets';
import {isRemoteAsset, normalizePublicAssetPath} from './asset-paths';

export const ACTIVE_TRACK_TOKEN = '@active-track';
export const ACTIVE_TRACK_MANIFEST = 'assets/tracks/active-track.json';

export const AUDIO_FILE_EXTENSIONS = [
  'aac',
  'flac',
  'm4a',
  'mp3',
  'mp4',
  'oga',
  'ogg',
  'opus',
  'wav',
  'webm',
] as const;

type ActiveTrackManifest = {
  audioFile: string;
};

const extensionPattern = new RegExp(`\\.(${AUDIO_FILE_EXTENSIONS.join('|')})$`, 'i');

export const isAudioAsset = (fileName: string) => extensionPattern.test(fileName.split('?')[0] ?? '');

const parseManifest = (value: unknown): ActiveTrackManifest => {
  if (!value || typeof value !== 'object' || !('audioFile' in value)) {
    throw new Error(
      `The active-track manifest at public/${ACTIVE_TRACK_MANIFEST} must contain an "audioFile" string.`,
    );
  }

  const audioFile = (value as {audioFile?: unknown}).audioFile;

  if (typeof audioFile !== 'string' || audioFile.trim().length === 0) {
    throw new Error(
      `The active-track manifest at public/${ACTIVE_TRACK_MANIFEST} contains an invalid "audioFile" value.`,
    );
  }

  if (audioFile.trim() === ACTIVE_TRACK_TOKEN) {
    throw new Error(
      `The active-track manifest cannot point back to ${ACTIVE_TRACK_TOKEN}. Choose a real audio asset instead.`,
    );
  }

  return {audioFile};
};

export const readActiveTrackManifest = async (): Promise<ActiveTrackManifest> => {
  const manifestSrc = resolveAsset(ACTIVE_TRACK_MANIFEST);
  const response = await fetch(manifestSrc, {cache: 'no-store'});

  if (!response.ok) {
    throw new Error(
      `Could not load public/${ACTIVE_TRACK_MANIFEST} (${response.status} ${response.statusText}). ` +
        'Open Studio-Tools > Track-Asset-Manager and select a track.',
    );
  }

  return parseManifest(await response.json());
};

export const resolveConfiguredAudioFile = async (audioFile: string): Promise<string> => {
  const configured = audioFile.trim();

  if (!configured) {
    throw new Error(
      'No audio track is configured. Set audioFile to a public asset path, a remote URL, or @active-track.',
    );
  }

  if (configured !== ACTIVE_TRACK_TOKEN) {
    return isRemoteAsset(configured) ? configured : normalizePublicAssetPath(configured);
  }

  const manifest = await readActiveTrackManifest();
  return isRemoteAsset(manifest.audioFile)
    ? manifest.audioFile.trim()
    : normalizePublicAssetPath(manifest.audioFile);
};
