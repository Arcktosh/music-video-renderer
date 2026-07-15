import {defaultMusicVideoProps} from './defaults';
import type {MusicVideoProps, MusicVideoTemplateId} from './schema';

export type TemplatePreset = {
  id: MusicVideoTemplateId;
  compositionId: string;
  name: string;
  description: string;
  props: MusicVideoProps;
};

export const templatePresets: TemplatePreset[] = [
  {
    id: 'neon-pulse',
    compositionId: 'NeonPulse',
    name: 'Neon Pulse',
    description: 'The original luminous cover-and-spectrum treatment.',
    props: {...defaultMusicVideoProps, template: 'neon-pulse'},
  },
  {
    id: 'editorial-cut',
    compositionId: 'EditorialCut',
    name: 'Editorial Cut',
    description: 'Magazine typography, print grids, and restrained motion.',
    props: {
      ...defaultMusicVideoProps,
      template: 'editorial-cut',
      backgroundColor: '#F2EDE2',
      primaryColor: '#E34831',
      secondaryColor: '#B2A99B',
      accentColor: '#171717',
      textColor: '#171717',
      mutedTextColor: '#6F695F',
    },
  },
  {
    id: 'vinyl-orbit',
    compositionId: 'VinylOrbit',
    name: 'Vinyl Orbit',
    description: 'Rotating record, radial spectrum, and warm analog color.',
    props: {
      ...defaultMusicVideoProps,
      template: 'vinyl-orbit',
      backgroundColor: '#120D13',
      primaryColor: '#FFB347',
      secondaryColor: '#F2719D',
      accentColor: '#FF5A62',
      textColor: '#FFF4E7',
      mutedTextColor: '#C9AFAE',
    },
  },
  {
    id: 'kinetic-type',
    compositionId: 'KineticType',
    name: 'Kinetic Type',
    description: 'Oversized typography and beat-driven graphic blocks.',
    props: {
      ...defaultMusicVideoProps,
      template: 'kinetic-type',
      backgroundColor: '#10131A',
      primaryColor: '#3D5AFE',
      secondaryColor: '#00D6FF',
      accentColor: '#C7FF32',
      textColor: '#F7F8FF',
      mutedTextColor: '#A7B0C4',
    },
  },
  {
    id: 'aurora-glass',
    compositionId: 'AuroraGlass',
    name: 'Aurora Glass',
    description: 'Translucent glass panels floating over an aurora field.',
    props: {
      ...defaultMusicVideoProps,
      template: 'aurora-glass',
      backgroundColor: '#061018',
      primaryColor: '#7B61FF',
      secondaryColor: '#2CE6D0',
      accentColor: '#F56CC6',
      textColor: '#F8FBFF',
      mutedTextColor: '#AEC1D1',
    },
  },
  {
    id: 'retro-grid',
    compositionId: 'RetroGrid',
    name: 'Retro Grid',
    description: 'Synthwave horizon, scanlines, and neon terminal graphics.',
    props: {
      ...defaultMusicVideoProps,
      template: 'retro-grid',
      backgroundColor: '#050315',
      primaryColor: '#FF3CAC',
      secondaryColor: '#2B86C5',
      accentColor: '#FFE04B',
      textColor: '#F8F2FF',
      mutedTextColor: '#AFA3C7',
    },
  },
];

export const getTemplatePreset = (id: MusicVideoTemplateId): TemplatePreset => {
  const preset = templatePresets.find((candidate) => candidate.id === id);
  if (!preset) {
    throw new Error(`Unknown music video template: ${id}`);
  }

  return preset;
};
