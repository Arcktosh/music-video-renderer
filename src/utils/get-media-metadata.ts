import {ALL_FORMATS, Input, UrlSource} from 'mediabunny';

export const getMediaMetadata = async (src: string) => {
  const input = new Input({
    formats: ALL_FORMATS,
    source: new UrlSource(src, {
      getRetryDelay: () => null,
    }),
  });

  const durationInSeconds = await input.computeDuration();

  if (!Number.isFinite(durationInSeconds) || durationInSeconds <= 0) {
    throw new Error(`Could not determine a valid audio duration for: ${src}`);
  }

  return {durationInSeconds};
};
