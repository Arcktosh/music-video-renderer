import type {CalculateMetadataFunction} from 'remotion';
import type {MusicVideoProps} from './schema';
import {resolveAsset} from './utils/assets';
import {resolveConfiguredAudioFile} from './utils/audio-track';
import {getMediaMetadata} from './utils/get-media-metadata';

const FPS = 30;

export const calculateMusicVideoMetadata: CalculateMetadataFunction<MusicVideoProps> = async ({
  props,
  abortSignal,
}) => {
  const audioFile = await resolveConfiguredAudioFile(props.audioFile);

  if (abortSignal.aborted) {
    throw new Error('Audio metadata calculation was aborted.');
  }

  const audioSrc = resolveAsset(audioFile);
  const {durationInSeconds} = await getMediaMetadata(audioSrc);
  const trimmedDuration =
    durationInSeconds - props.audioStartSeconds - props.audioEndTrimSeconds;

  if (trimmedDuration <= 0) {
    throw new Error(
      `The audio trims remove the entire track. Source duration: ${durationInSeconds.toFixed(2)}s, ` +
        `start trim: ${props.audioStartSeconds.toFixed(2)}s, ` +
        `end trim: ${props.audioEndTrimSeconds.toFixed(2)}s.`,
    );
  }

  const audioDurationInFrames = Math.max(1, Math.ceil(trimmedDuration * FPS));
  const outroDurationInFrames = Math.max(1, Math.round(props.outroSeconds * FPS));
  const appendedOutroFrames =
    props.outroPlacement === 'after-track' ? outroDurationInFrames : 0;

  return {
    durationInFrames: audioDurationInFrames + appendedOutroFrames,
    fps: FPS,
    props: {
      ...props,
      audioFile,
    },
    defaultCodec: 'h264',
    defaultPixelFormat: 'yuv420p',
  };
};
