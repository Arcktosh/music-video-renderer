import {zColor} from '@remotion/zod-types';
import {z} from 'zod';

export const musicVideoTemplateIds = [
  'neon-pulse',
  'editorial-cut',
  'vinyl-orbit',
  'kinetic-type',
  'aurora-glass',
  'retro-grid',
] as const;

export type MusicVideoTemplateId = (typeof musicVideoTemplateIds)[number];

export const musicVideoSchema = z.object({
  template: z.enum(musicVideoTemplateIds),
  audioFile: z
    .string()
    .min(1)
    .describe('Public asset path, remote URL, or @active-track'),
  coverFile: z.string(),
  logoFile: z.string(),
  title: z.string().min(1),
  artist: z.string().min(1),
  brandName: z.string().min(1),
  eyebrow: z.string(),
  website: z.string(),
  catalogLabel: z.string(),
  callToAction: z.string(),
  copyrightLine: z.string(),
  backgroundImageFile: z
    .string()
    .describe('Optional background image path or remote URL (used by Neon Pulse)'),
  backgroundImageFit: z.enum(['cover', 'contain']),
  backgroundImageOpacity: z.number().min(0).max(1).step(0.05),
  backgroundImageEffect: z.enum(['none', 'glitch']),
  backgroundGlitchIntensity: z.number().min(0).max(2).step(0.05),
  backgroundColor: zColor(),
  primaryColor: zColor(),
  secondaryColor: zColor(),
  accentColor: zColor(),
  textColor: zColor(),
  mutedTextColor: zColor(),
  visualizerSamples: z.enum(['32', '64', '128']),
  intensity: z.number().min(0.5).max(2).step(0.05),
  audioStartSeconds: z.number().min(0).max(600).step(0.1),
  audioEndTrimSeconds: z.number().min(0).max(600).step(0.1),
  outroSeconds: z.number().min(0.5).max(10).step(0.25),
  outroPlacement: z
    .enum(['over-track-end', 'after-track'])
    .describe('Overlay the outro within the song or append it after the song'),
  showCover: z.boolean(),
  showVisualizer: z.boolean(),
  showProgress: z.boolean(),
  showTimecode: z.boolean(),
  coverFit: z.enum(['cover', 'contain']),
});

export type MusicVideoProps = z.infer<typeof musicVideoSchema>;
