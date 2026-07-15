import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

type OutroCardProps = {
  frame: number;
  startFrame: number;
  logoSrc: string;
  brandName: string;
  title: string;
  artist: string;
  callToAction: string;
  website: string;
  textColor: string;
  mutedTextColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
};

const initials = (value: string) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export const OutroCard: React.FC<OutroCardProps> = ({
  frame,
  startFrame,
  logoSrc,
  brandName,
  title,
  artist,
  callToAction,
  website,
  textColor,
  mutedTextColor,
  primaryColor,
  secondaryColor,
  accentColor,
}) => {
  const { fps, width, height } = useVideoConfig();
  const localFrame = frame - startFrame;
  const opacity = interpolate(localFrame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = spring({
    frame: localFrame,
    fps,
    from: 0.82,
    to: 1,
    config: { damping: 16, mass: 0.9, stiffness: 115 },
  });
  const portrait = width / height < 0.8;
  const logoSize = portrait ? width * 0.24 : Math.min(width, height) * 0.2;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        background: "rgba(3,4,8,0.3)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          width: portrait ? "84%" : "74%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          color: textColor,
          transform: `scale(${scale})`,
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
            borderRadius: logoSize * 0.28,
            border: "1px solid rgba(255,255,255,0.25)",
            background: `linear-gradient(145deg, color-mix(in srgb, ${primaryColor} 32%, transparent), rgba(255,255,255,0.07))`,
            boxShadow: `
              0 28px 90px rgba(0,0,0,0.42),
              0 0 ${logoSize * 0.72}px color-mix(in srgb, ${secondaryColor} 35%, transparent)
            `,
          }}
        >
          {logoSrc ? (
            <Img
              src={logoSrc}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              from={6170}
              durationInFrames={74}
              trimBefore={6170}
            />
          ) : (
            <span style={{ fontSize: logoSize * 0.35, fontWeight: 900 }}>
              {initials(brandName)}
            </span>
          )}
        </div>

        <div
          style={{
            marginTop: portrait ? 56 : 42,
            fontSize: portrait ? 29 : 27,
            fontWeight: 900,
            letterSpacing: portrait ? 7 : 8,
            textTransform: "uppercase",
          }}
        >
          {brandName}
        </div>

        <div
          style={{
            marginTop: portrait ? 48 : 37,
            fontSize: portrait ? 64 : Math.min(width * 0.048, 68),
            lineHeight: 0.98,
            fontWeight: 900,
            letterSpacing: -2.4,
            textTransform: "uppercase",
            textWrap: "balance",
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 20,
            color: mutedTextColor,
            fontSize: portrait ? 23 : 20,
            fontWeight: 800,
            letterSpacing: 4.2,
            textTransform: "uppercase",
          }}
        >
          {artist}
        </div>

        <div
          style={{
            width: portrait ? 170 : 150,
            height: 3,
            marginTop: portrait ? 44 : 36,
            borderRadius: 99,
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
            boxShadow: `0 0 26px color-mix(in srgb, ${secondaryColor} 45%, transparent)`,
          }}
        />

        <div
          style={{
            marginTop: portrait ? 42 : 33,
            color: textColor,
            fontSize: portrait ? 16 : 14,
            fontWeight: 900,
            letterSpacing: portrait ? 4.2 : 3.8,
          }}
        >
          {callToAction}
        </div>

        <div
          style={{
            marginTop: 16,
            color: mutedTextColor,
            fontSize: portrait ? 14 : 12,
            fontWeight: 700,
            letterSpacing: portrait ? 3.2 : 2.8,
            textTransform: "uppercase",
          }}
        >
          {website}
        </div>
      </div>
    </AbsoluteFill>
  );
};
