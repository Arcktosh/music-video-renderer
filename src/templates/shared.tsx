import React from "react";
import { AbsoluteFill, Img, interpolate, spring } from "remotion";
import { ProgressRail } from "../components/ProgressRail";
import type { MusicVideoRuntime } from "./types";

export const FONT_SANS =
  "Inter, Avenir Next, Helvetica Neue, Arial, sans-serif";
export const FONT_SERIF =
  "Iowan Old Style, Baskerville, Georgia, Times New Roman, serif";
export const FONT_MONO =
  "SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace";

export const translucent = (color: string, percentage: number) =>
  `color-mix(in srgb, ${color} ${percentage}%, transparent)`;

const initials = (value: string) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export const BrandMark: React.FC<{
  runtime: MusicVideoRuntime;
  color?: string;
  compact?: boolean;
  boxed?: boolean;
}> = ({
  runtime,
  color = runtime.textColor,
  compact = false,
  boxed = false,
}) => {
  const logoSize = compact ? 42 : 54;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: compact ? 12 : 16,
        color,
        padding: boxed ? (compact ? "9px 12px" : "11px 15px") : 0,
        border: boxed ? `1px solid ${translucent(color, 24)}` : undefined,
        background: boxed
          ? translucent(runtime.backgroundColor, 46)
          : undefined,
        borderRadius: boxed ? 999 : undefined,
        backdropFilter: boxed ? "blur(14px)" : undefined,
      }}
    >
      <div
        style={{
          width: logoSize,
          height: logoSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: compact ? 12 : 15,
          border: `1px solid ${translucent(color, 22)}`,
          background: translucent(runtime.primaryColor, 18),
          flexShrink: 0,
        }}
      >
        {runtime.logoSrc ? (
          <Img
            src={runtime.logoSrc}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <span
            style={{
              fontFamily: FONT_SANS,
              fontSize: compact ? 14 : 17,
              fontWeight: 900,
            }}
          >
            {initials(runtime.brandName)}
          </span>
        )}
      </div>
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: compact ? 16 : 20,
          fontWeight: 900,
          letterSpacing: compact ? 3.5 : 5,
          whiteSpace: "nowrap",
        }}
      >
        {runtime.brandName}
      </div>
    </div>
  );
};

export const ArtworkFrame: React.FC<{
  runtime: MusicVideoRuntime;
  size: number;
  borderRadius?: number | string;
  objectFit?: "cover" | "contain";
  showShadow?: boolean;
}> = ({
  runtime,
  size,
  borderRadius = size * 0.055,
  objectFit = runtime.coverFit,
  showShadow = true,
}) => (
  <div
    style={{
      width: size,
      height: size,
      position: "relative",
      overflow: "hidden",
      borderRadius,
      flexShrink: 0,
      background: `radial-gradient(circle at 20% 18%, ${runtime.primaryColor}, transparent 48%), radial-gradient(circle at 82% 78%, ${runtime.accentColor}, transparent 46%), ${runtime.backgroundColor}`,
      boxShadow: showShadow
        ? `0 ${size * 0.08}px ${size * 0.18}px rgba(0,0,0,0.38), inset 0 0 0 1px ${translucent(
            runtime.textColor,
            20,
          )}`
        : undefined,
    }}
  >
    {runtime.coverSrc ? (
      <Img
        src={runtime.coverSrc}
        style={{ width: "100%", height: "100%", objectFit }}
      />
    ) : (
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          padding: size * 0.08,
          color: runtime.textColor,
          fontFamily: FONT_SANS,
        }}
      >
        <div
          style={{ fontSize: size * 0.09, fontWeight: 950, lineHeight: 0.9 }}
        >
          {runtime.title}
        </div>
        <div
          style={{
            fontSize: size * 0.034,
            marginTop: size * 0.025,
            letterSpacing: size * 0.005,
          }}
        >
          {runtime.artist}
        </div>
      </AbsoluteFill>
    )}
  </div>
);

export const TemplateProgress: React.FC<{
  runtime: MusicVideoRuntime;
  compact?: boolean;
}> = ({ runtime, compact = runtime.compact }) => {
  if (!runtime.showProgress) {
    return null;
  }

  return (
    <ProgressRail
      frame={runtime.frame}
      audioDurationInFrames={runtime.audioDurationInFrames}
      fps={runtime.fps}
      showTimecode={runtime.showTimecode}
      textColor={runtime.textColor}
      mutedTextColor={runtime.mutedTextColor}
      primaryColor={runtime.primaryColor}
      secondaryColor={runtime.secondaryColor}
      accentColor={runtime.accentColor}
      compact={compact}
    />
  );
};

export const SpectrumBars: React.FC<{
  runtime: MusicVideoRuntime;
  height: number;
  mirrored?: boolean;
  blocky?: boolean;
  colorMode?: "gradient" | "single";
}> = ({
  runtime,
  height,
  mirrored = false,
  blocky = false,
  colorMode = "gradient",
}) => {
  if (!runtime.showVisualizer) {
    return null;
  }

  const values = runtime.spectrum;
  const gap = values.length >= 128 ? 2 : values.length >= 64 ? 4 : 7;

  return (
    <div
      style={{
        width: "100%",
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap,
        overflow: "hidden",
      }}
    >
      {values.map((value, index) => {
        const normalized = Math.min(
          1,
          Math.pow(value * 7.3 * runtime.intensity, 0.7),
        );
        const position = index / Math.max(1, values.length - 1);
        const barHeight = 4 + normalized * height * (mirrored ? 0.48 : 0.94);
        const color =
          colorMode === "single"
            ? runtime.primaryColor
            : position < 0.38
              ? runtime.primaryColor
              : position < 0.72
                ? runtime.secondaryColor
                : runtime.accentColor;

        return (
          <div
            key={index}
            style={{
              flex: 1,
              minWidth: 2,
              maxWidth:
                values.length >= 128 ? 7 : values.length >= 64 ? 12 : 22,
              height: mirrored ? barHeight * 2 : barHeight,
              borderRadius: blocky ? 0 : 999,
              background: color,
              opacity: 0.46 + normalized * 0.54,
              boxShadow: `0 0 ${5 + normalized * 15}px ${translucent(color, 36)}`,
            }}
          />
        );
      })}
    </div>
  );
};

export const CircularSpectrum: React.FC<{
  runtime: MusicVideoRuntime;
  size: number;
  radius?: number;
}> = ({ runtime, size, radius = size * 0.4 }) => {
  if (!runtime.showVisualizer) {
    return null;
  }

  const values = runtime.spectrum.filter(
    (_, index) => index % (runtime.spectrum.length >= 128 ? 4 : 2) === 0,
  );
  const barWidth = Math.max(2.5, size * 0.007);

  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      {values.map((value, index) => {
        const normalized = Math.min(
          1,
          Math.pow(value * 7.4 * runtime.intensity, 0.7),
        );
        const angle = (index / values.length) * 360;
        const barHeight = 7 + normalized * size * 0.105;
        const color =
          index % 5 === 0 ? runtime.accentColor : runtime.primaryColor;

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: size / 2 - barWidth / 2,
              top: size / 2,
              width: barWidth,
              height: barHeight,
              borderRadius: 999,
              background: color,
              boxShadow: `0 0 ${7 + normalized * 18}px ${translucent(color, 44)}`,
              transformOrigin: `${barWidth / 2}px 0`,
              transform: `rotate(${angle}deg) translateY(${-radius}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

export type OutroTreatment = "paper" | "vinyl" | "bold" | "glass" | "retro";

export const TemplateOutro: React.FC<{
  runtime: MusicVideoRuntime;
  treatment: OutroTreatment;
}> = ({ runtime, treatment }) => {
  const localFrame = runtime.frame - runtime.outroStartFrame;
  const opacity = interpolate(localFrame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = spring({
    frame: localFrame,
    fps: runtime.fps,
    from: 0.86,
    to: 1,
    config: { damping: 17, mass: 0.9, stiffness: 112 },
  });
  const background =
    treatment === "paper"
      ? runtime.backgroundColor
      : treatment === "bold"
        ? `linear-gradient(135deg, ${runtime.primaryColor}, ${runtime.accentColor})`
        : treatment === "retro"
          ? `radial-gradient(circle at 50% 42%, ${translucent(runtime.primaryColor, 54)}, transparent 42%), ${runtime.backgroundColor}`
          : treatment === "vinyl"
            ? `radial-gradient(circle at 50% 48%, ${translucent(runtime.accentColor, 26)}, transparent 50%), ${runtime.backgroundColor}`
            : `radial-gradient(circle at 50% 45%, ${translucent(runtime.secondaryColor, 28)}, transparent 54%), ${runtime.backgroundColor}`;
  const foreground =
    treatment === "bold" ? runtime.backgroundColor : runtime.textColor;
  const logoSize = runtime.layout === "portrait" ? 132 : 112;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: runtime.layout === "portrait" ? 82 : 108,
        opacity,
        transform: `scale(${scale})`,
        background,
        color: foreground,
        fontFamily:
          treatment === "retro"
            ? FONT_MONO
            : treatment === "paper"
              ? FONT_SERIF
              : FONT_SANS,
        overflow: "hidden",
      }}
    >
      {treatment === "retro" ? (
        <AbsoluteFill
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent 0 5px, ${translucent("#FFFFFF", 5)} 5px 6px)`,
          }}
        />
      ) : null}
      {treatment === "paper" ? (
        <div
          style={{
            position: "absolute",
            inset: runtime.layout === "portrait" ? 40 : 56,
            border: `2px solid ${translucent(foreground, 24)}`,
          }}
        />
      ) : null}
      <div
        style={{
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: logoSize,
            height: logoSize,
            borderRadius: treatment === "paper" ? 0 : logoSize * 0.26,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${translucent(foreground, 24)}`,
            background: translucent(
              runtime.primaryColor,
              treatment === "bold" ? 12 : 24,
            ),
          }}
        >
          {runtime.logoSrc ? (
            <Img
              src={runtime.logoSrc}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              from={6144}
              durationInFrames={100}
              trimBefore={6144}
            />
          ) : (
            <span style={{ fontSize: logoSize * 0.32, fontWeight: 900 }}>
              {initials(runtime.brandName)}
            </span>
          )}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: runtime.layout === "portrait" ? 68 : 72,
            lineHeight: 0.94,
            fontWeight: treatment === "paper" ? 700 : 950,
            letterSpacing: treatment === "retro" ? 2 : -2.5,
            maxWidth: 1080,
          }}
        >
          {runtime.callToAction || "LISTEN NOW"}
        </div>
        <div
          style={{
            marginTop: 22,
            color: treatment === "bold" ? foreground : runtime.accentColor,
            fontFamily: FONT_MONO,
            fontSize: runtime.layout === "portrait" ? 19 : 17,
            fontWeight: 850,
            letterSpacing: runtime.layout === "portrait" ? 4 : 5.5,
          }}
        >
          {runtime.website || runtime.brandName}
        </div>
      </div>
    </AbsoluteFill>
  );
};
