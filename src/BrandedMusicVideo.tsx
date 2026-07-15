import { Audio } from "@remotion/media";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { MusicVideoProps } from "./schema";
import { templateComponents } from "./templates";
import type { MusicVideoLayout, MusicVideoRuntime } from "./templates/types";
import { AudioAssetDock } from "./studio/AudioAssetDock";
import { resolveAsset } from "./utils/assets";
import { getAssetFileName } from "./utils/asset-paths";

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const average = (values: number[]) => {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

export const BrandedMusicVideo: React.FC<MusicVideoProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const aspectRatio = width / height;
  const layout: MusicVideoLayout =
    aspectRatio < 0.8 ? "portrait" : aspectRatio < 1.25 ? "square" : "wide";
  const compact = layout !== "wide";

  const audioSrc = resolveAsset(props.audioFile);
  const coverSrc = props.coverFile ? resolveAsset(props.coverFile) : "";
  const logoSrc = props.logoFile ? resolveAsset(props.logoFile) : "";
  const audioData = useAudioData(audioSrc);

  const configuredOutroFrames = Math.max(
    1,
    Math.round(props.outroSeconds * fps),
  );
  const outroIsAppended = props.outroPlacement === "after-track";
  const audioDurationInFrames = Math.max(
    1,
    outroIsAppended
      ? durationInFrames - configuredOutroFrames
      : durationInFrames,
  );
  const outroDurationInFrames = Math.min(
    configuredOutroFrames,
    durationInFrames,
  );
  const outroStartFrame = outroIsAppended
    ? Math.max(0, audioDurationInFrames - Math.round(fps * 0.12))
    : Math.max(0, durationInFrames - outroDurationInFrames);
  const trimBeforeInFrames = Math.max(
    0,
    Math.round(props.audioStartSeconds * fps),
  );
  const samples = Number(props.visualizerSamples);
  const activeAudioFrame = Math.max(
    0,
    Math.min(
      trimBeforeInFrames + frame,
      trimBeforeInFrames + audioDurationInFrames - 1,
    ),
  );

  const getVisualization = (sampleFrame: number) => {
    if (!audioData) {
      return Array.from({ length: samples }, (_, index) => {
        const frequency = 0.045 + index * 0.0024;
        return (
          0.018 + Math.abs(Math.sin(frame * frequency + index * 0.62)) * 0.022
        );
      });
    }

    return visualizeAudio({
      fps,
      frame: Math.max(0, sampleFrame),
      audioData,
      numberOfSamples: samples,
    });
  };

  const previous = getVisualization(activeAudioFrame - 1);
  const current = getVisualization(activeAudioFrame);
  const next = getVisualization(activeAudioFrame + 1);
  const spectrum = current.map(
    (value, index) =>
      previous[index] * 0.24 + value * 0.58 + next[index] * 0.18,
  );

  const bassBandSize = Math.max(2, Math.round(spectrum.length * 0.1));
  const bass = clamp01(
    average(spectrum.slice(0, bassBandSize)) * 9.2 * props.intensity,
  );
  const energy = clamp01(average(spectrum) * 12.5 * props.intensity);

  const introProgress = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 17, mass: 0.85, stiffness: 112 },
  });
  const fadeOutLead = Math.min(
    Math.round(fps * 0.2),
    Math.floor(audioDurationInFrames / 5),
  );
  const fadeOutTail = Math.min(
    Math.round(fps * 0.42),
    Math.max(1, Math.floor(outroDurationInFrames / 3)),
  );
  const fadeOutStart = Math.max(0, outroStartFrame - fadeOutLead);
  const fadeOutEnd = Math.min(durationInFrames, outroStartFrame + fadeOutTail);
  const contentOpacity = interpolate(
    frame,
    [fadeOutStart, fadeOutEnd],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const chromeOpacity =
    interpolate(frame, [0, Math.min(16, audioDurationInFrames / 3)], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) * contentOpacity;

  const safeX = layout === "portrait" ? 72 : layout === "square" ? 64 : 102;
  const safeY = layout === "portrait" ? 78 : layout === "square" ? 58 : 62;
  const audioFadeFrames = Math.max(
    1,
    Math.min(Math.round(fps * 0.52), Math.floor(audioDurationInFrames / 4)),
  );

  const runtime: MusicVideoRuntime = {
    ...props,
    frame,
    fps,
    width,
    height,
    durationInFrames,
    layout,
    compact,
    audioSrc,
    coverSrc,
    logoSrc,
    outroDurationInFrames,
    outroStartFrame,
    audioDurationInFrames,
    trimBeforeInFrames,
    spectrum,
    bass,
    energy,
    introProgress,
    contentOpacity,
    chromeOpacity,
    safeX,
    safeY,
  };

  const SelectedTemplate = templateComponents[props.template];
  const audioName = `Audio • ${getAssetFileName(props.audioFile)}`;
  const visualName = `Visual • ${props.template}`;

  return (
    <AbsoluteFill
      style={{ backgroundColor: props.backgroundColor, overflow: "hidden" }}
    >
      <Audio
        src={audioSrc}
        from={13}
        trimBefore={trimBeforeInFrames}
        durationInFrames={audioDurationInFrames}
        name={audioName}
        showInTimeline
        volume={(audioFrame) => {
          const fadeIn = Math.min(1, audioFrame / audioFadeFrames);
          const fadeOut = Math.min(
            1,
            (audioDurationInFrames - 1 - audioFrame) / audioFadeFrames,
          );
          return Math.max(0, Math.min(fadeIn, fadeOut));
        }}
      />
      <Sequence
        from={0}
        durationInFrames={durationInFrames}
        name={visualName}
        showInTimeline
      >
        <SelectedTemplate runtime={runtime} />
      </Sequence>
      <AudioAssetDock
        activeAudioFile={props.audioFile}
        backgroundColor={props.backgroundColor}
        accentColor={props.accentColor}
        textColor={props.textColor}
        mutedTextColor={props.mutedTextColor}
      />
    </AbsoluteFill>
  );
};
