export const normalizePublicAssetPath = (src: string) =>
  src.trim().replace(/^public\//i, '').replace(/^\/+/, '');

export const isRemoteAsset = (src: string) =>
  /^(https?:)?\/\//i.test(src) || src.startsWith('data:') || src.startsWith('blob:');

export const getAssetFileName = (src: string) => {
  const withoutQuery = src.split(/[?#]/)[0] ?? src;
  const segments = withoutQuery.split('/').filter(Boolean);
  return decodeURIComponent(segments.at(-1) ?? src);
};
