import type React from 'react';
import type {MusicVideoProps} from '../schema';

export type MusicVideoLayout = 'wide' | 'square' | 'portrait';

export type MusicVideoRuntime = MusicVideoProps & {
  frame: number;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  layout: MusicVideoLayout;
  compact: boolean;
  audioSrc: string;
  coverSrc: string;
  logoSrc: string;
  outroDurationInFrames: number;
  outroStartFrame: number;
  audioDurationInFrames: number;
  trimBeforeInFrames: number;
  spectrum: number[];
  bass: number;
  energy: number;
  introProgress: number;
  contentOpacity: number;
  chromeOpacity: number;
  safeX: number;
  safeY: number;
};

export type MusicVideoTemplateComponent = React.FC<{runtime: MusicVideoRuntime}>;
