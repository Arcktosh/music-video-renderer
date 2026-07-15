# Branded Remotion Music Video — Template Pack v1.2

A reusable React + Remotion music-video system with six audio-reactive templates, responsive formats, automatic track-length timelines, and an in-Studio audio asset loader.

![Landscape template gallery](out/template-gallery.png)

## What changed in v1.2

- Adding or selecting a track recalculates every music-video composition from the track's actual duration.
- The selected track appears in the Remotion timeline as a named layer: `Audio • filename.ext`.
- A new `Studio-Tools / Track-Asset-Manager` composition imports audio into `public/assets/tracks/`.
- Every music-video composition also has an `♫ AUDIO ASSETS` control for selecting an existing asset or importing a new one.
- The branded outro overlays the end of the track by default, so it no longer adds silence after the music.
- An optional `after-track` outro mode remains available when a post-track end card is intentional.
- A command-line track importer is included for non-Studio workflows.

## Add a track in Remotion Studio

```bash
npm install
npm run dev
```

Then:

1. Open `Branded-Music-Video / Studio-Tools / Track-Asset-Manager`.
2. Drop an audio file onto the import area, or click **IMPORT TRACK**.
3. Choose **ADD TO TIMELINE** beside any audio asset.
4. Open a composition under `Quick-Start` or `Template-Gallery`.

The composition will refresh automatically. Its duration is calculated from the active track, and the audio is visible on the timeline from frame 0.

The same asset panel is available directly inside each music-video composition through the `♫ AUDIO ASSETS` button.

## Automatic duration behavior

At 30 fps, the music section is calculated as:

```text
audio frames = ceil((source duration - start trim - end trim) × 30)
```

The `outroPlacement` property controls the final composition length:

| `outroPlacement` | Result |
|---|---|
| `over-track-end` | Default. The outro overlays the last `outroSeconds` of the song. Total video duration equals the trimmed track duration. |
| `after-track` | Appends the outro after the song. Total duration equals the trimmed track duration plus `outroSeconds`. |

For example, a 3:42.4 track with no trims produces a 3:42.4 composition in `over-track-end` mode. Changing the track, `audioStartSeconds`, or `audioEndTrimSeconds` causes Remotion to recalculate the timeline.

## How the active-track asset works

Studio imports tracks into:

```text
public/assets/tracks/
```

The selected asset is recorded in:

```text
public/assets/tracks/active-track.json
```

Default compositions use this token:

```json
{
  "audioFile": "@active-track"
}
```

This keeps all responsive formats and template presets linked to the same selected track. A direct public path or browser-accessible HTTP(S) URL may still be supplied through `audioFile` when a composition must use a different track.

## Add a track from the command line

```bash
npm run track:add -- /path/to/song.mp3
```

This command:

- copies the file to `public/assets/tracks/`;
- makes the copied file the active track;
- resets audio trims to zero in `props/custom.json`;
- keeps the custom render linked to `@active-track`.

Then render:

```bash
npm run render:custom
```

Common audio asset extensions accepted by the loader include MP3, WAV, M4A, AAC, FLAC, OGG, Opus, WebM, and MP4 containers with audio.

## Template library

| Template ID | Gallery composition | Visual direction |
|---|---|---|
| `neon-pulse` | `Template-NeonPulse` | Luminous cover art, vinyl edge, spectrum bars, and dark club color |
| `editorial-cut` | `Template-EditorialCut` | Magazine typography, print grid, asymmetric art direction, and restrained motion |
| `vinyl-orbit` | `Template-VinylOrbit` | Rotating record, radial audio spectrum, and warm analog color |
| `kinetic-type` | `Template-KineticType` | Oversized type, beat-driven blocks, hard cuts, and poster graphics |
| `aurora-glass` | `Template-AuroraGlass` | Translucent glass cards floating over a soft aurora field |
| `retro-grid` | `Template-RetroGrid` | Synthwave horizon, scanlines, neon spectrum, and terminal-style labels |

## Responsive compositions

All three Quick-Start compositions accept any template ID:

| Composition | Resolution | Typical use |
|---|---:|---|
| `MusicVideo-Landscape` | 1920 × 1080 | YouTube, web, venue screens |
| `MusicVideo-Square` | 1080 × 1080 | Feed posts and album promotion |
| `MusicVideo-Vertical` | 1080 × 1920 | Reels, Shorts, and TikTok |

The six `Template-*` compositions are one-click 1920 × 1080 starting points with recommended palettes.

## Add branding assets

Place artwork and logos inside `public/`, for example:

```text
public/
  artwork/my-cover.jpg
  branding/my-logo.png
```

Then update `props/custom.json`:

```json
{
  "template": "aurora-glass",
  "audioFile": "@active-track",
  "coverFile": "artwork/my-cover.jpg",
  "logoFile": "branding/my-logo.png",
  "title": "Track Title",
  "artist": "Artist Name",
  "brandName": "YOUR BRAND",
  "website": "yourbrand.com",
  "backgroundColor": "#061018",
  "primaryColor": "#7B61FF",
  "secondaryColor": "#2CE6D0",
  "accentColor": "#F56CC6",
  "textColor": "#F8FBFF",
  "mutedTextColor": "#AEC1D1",
  "outroPlacement": "over-track-end"
}
```

Public asset paths are relative to `public/` and should not begin with `/`.

## Preset files

Recommended starting props are included for every visual style:

```text
props/presets/
  neon-pulse.json
  editorial-cut.json
  vinyl-orbit.json
  kinetic-type.json
  aurora-glass.json
  retro-grid.json
```

Render a preset in a responsive format:

```bash
npx remotion render src/index.ts MusicVideo-Vertical out/aurora-vertical.mp4 \
  --props=props/presets/aurora-glass.json \
  --codec=h264 \
  --pixel-format=yuv420p
```

Because the preset uses `@active-track`, it automatically uses the current asset selected in Studio or by `npm run track:add`.

## Render commands

```bash
# Active track plus props/custom.json
npm run render:custom

# Default Quick-Start formats
npm run render:landscape
npm run render:square
npm run render:vertical

# Individual landscape template presets
npm run render:neon
npm run render:editorial
npm run render:vinyl
npm run render:kinetic
npm run render:aurora
npm run render:retro

# All six landscape presets
npm run render:templates
```

## Main controls

| Property | Purpose |
|---|---|
| `template` | Selects one of the six visual systems |
| `audioFile` | Uses `@active-track`, a public asset path, or a browser-accessible URL |
| `audioStartSeconds` | Trims time from the beginning of the source track |
| `audioEndTrimSeconds` | Trims time from the end of the source track |
| `outroSeconds` | Controls the branded end-card duration |
| `outroPlacement` | Overlays the track ending or appends the outro after the track |
| `visualizerSamples` | Chooses 32, 64, or 128 spectrum samples |
| `intensity` | Adjusts audio-reactive movement and visualizer gain |
| `showCover` | Toggles cover artwork where supported |
| `showVisualizer` | Toggles audio visualization |
| `showProgress` | Toggles the progress rail |
| `showTimecode` | Toggles elapsed and duration labels |
| `coverFit` | Chooses `cover` or `contain` for artwork |
| Color properties | Control the template palette and text colors |

## Project structure

```text
src/
  BrandedMusicVideo.tsx       Audio layer, timeline labels, audio analysis, and template runtime
  Root.tsx                    Studio tool, responsive compositions, and gallery registrations
  calculate-metadata.ts       Track-duration, trims, and outro-duration calculation
  defaults.ts                 Defaults linked to @active-track
  schema.ts                   Studio-editable Zod props
  studio/
    AudioAssetDock.tsx        Import/select assets and add the active track to the timeline
    TrackAssetManager.tsx     Dedicated Studio asset-management composition
  templates/                  Six responsive visual systems
  components/                 Shared visual components
  utils/
    audio-track.ts            Active-track manifest and path resolution
    get-media-metadata.ts     Media duration reader
public/
  assets/tracks/
    active-track.json         Currently selected timeline track
    demo-track.wav            Synthetic placeholder track
  cover.svg                   Replaceable sample cover artwork
  logo.svg                    Replaceable sample logo
  noise.png                   Static grain texture
props/
  custom.json                 Custom render settings
  preview.json                Short review-render settings
  presets/                    Six template-specific configurations
scripts/
  add-track.mjs               Command-line asset importer
```

## Implementation notes

- `calculateMetadata()` reads the selected source duration before the composition is finalized.
- The returned duration and resolved audio path are shared by landscape, square, vertical, and gallery compositions.
- `<Audio>` is named and exposed in Remotion's timeline.
- `reevaluateComposition()` is called after selecting or importing a track so Studio refreshes the duration.
- The asset panel is Studio-only and does not appear in rendered video output.
- Audio-reactive visuals use `useAudioData()` and `visualizeAudio()` from `@remotion/media-utils`.
- The included track, artwork, logo, and brand copy are placeholders.

## Validation

```bash
npm run check
npm run compositions
```

The project should report the demo track as 300 frames at 30 fps (10 seconds) with the default `over-track-end` setting.
