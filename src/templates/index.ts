import type {MusicVideoTemplateId} from '../schema';
import {AuroraGlass} from './AuroraGlass';
import {EditorialCut} from './EditorialCut';
import {KineticType} from './KineticType';
import {NeonPulse} from './NeonPulse';
import {RetroGrid} from './RetroGrid';
import type {MusicVideoTemplateComponent} from './types';
import {VinylOrbit} from './VinylOrbit';

export const templateComponents: Record<MusicVideoTemplateId, MusicVideoTemplateComponent> = {
  'neon-pulse': NeonPulse,
  'editorial-cut': EditorialCut,
  'vinyl-orbit': VinylOrbit,
  'kinetic-type': KineticType,
  'aurora-glass': AuroraGlass,
  'retro-grid': RetroGrid,
};
