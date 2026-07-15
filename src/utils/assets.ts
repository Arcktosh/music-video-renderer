import {staticFile} from 'remotion';
import {isRemoteAsset, normalizePublicAssetPath} from './asset-paths';

export const resolveAsset = (src: string): string => {
  if (!src) {
    return '';
  }

  return isRemoteAsset(src) ? src : staticFile(normalizePublicAssetPath(src));
};
