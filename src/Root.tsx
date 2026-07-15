import React from 'react';
import {Composition, Folder, Still} from 'remotion';
import {BrandedMusicVideo} from './BrandedMusicVideo';
import {calculateMusicVideoMetadata} from './calculate-metadata';
import {defaultMusicVideoProps} from './defaults';
import './global.css';
import {musicVideoSchema} from './schema';
import {templatePresets} from './template-presets';
import {TrackAssetManager} from './studio/TrackAssetManager';

const FPS = 30;
const FALLBACK_DURATION = FPS * 12;

const commonCompositionProps = {
  component: BrandedMusicVideo,
  fps: FPS,
  durationInFrames: FALLBACK_DURATION,
  schema: musicVideoSchema,
  calculateMetadata: calculateMusicVideoMetadata,
};

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Branded-Music-Video">
      <Folder name="Studio-Tools">
        <Still
          id="Track-Asset-Manager"
          component={TrackAssetManager}
          width={1280}
          height={720}
        />
      </Folder>

      <Folder name="Quick-Start">
        <Composition
          id="MusicVideo-Landscape"
          {...commonCompositionProps}
          width={1920}
          height={1080}
          defaultProps={defaultMusicVideoProps}
        />
        <Composition
          id="MusicVideo-Square"
          {...commonCompositionProps}
          width={1080}
          height={1080}
          defaultProps={defaultMusicVideoProps}
        />
        <Composition
          id="MusicVideo-Vertical"
          {...commonCompositionProps}
          width={1080}
          height={1920}
          defaultProps={defaultMusicVideoProps}
        />
      </Folder>

      <Folder name="Template-Gallery">
        {templatePresets.map((preset) => (
          <Composition
            key={preset.id}
            id={`Template-${preset.compositionId}`}
            {...commonCompositionProps}
            width={1920}
            height={1080}
            defaultProps={preset.props}
          />
        ))}
      </Folder>
    </Folder>
  );
};
