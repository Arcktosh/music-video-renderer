import React from "react";
import { Img } from "remotion";

type CoverStageProps = {
  coverSrc: string;
  coverFit: "cover" | "contain";
  title: string;
  artist: string;
  frame: number;
  size: number;
  bass: number;
  energy: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  introProgress: number;
};

const getInitials = (value: string) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export const CoverStage: React.FC<CoverStageProps> = ({
  coverSrc,
  coverFit,
  title,
  artist,
  frame,
  size,
  bass,
  energy,
  primaryColor,
  secondaryColor,
  accentColor,
  textColor,
  introProgress,
}) => {
  const floatY = Math.sin(frame / 36) * size * 0.012;
  const rotateZ = Math.sin(frame / 62) * 1.25;
  const rotateY = Math.cos(frame / 76) * 2.8;
  const pulseScale = 1 + bass * 0.045;
  const discRotation = frame * 0.33;
  const translateIn = (1 - introProgress) * size * 0.16;

  return (
    <div
      style={{
        position: "relative",
        width: size * 1.18,
        height: size * 1.1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: size * 2.8,
        opacity: introProgress,
        transform: `translateY(${translateIn}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: size * 0.91,
          height: size * 0.91,
          borderRadius: "50%",
          right: size * 0.005,
          background: `
            radial-gradient(circle at center, #090A0F 0 9%, transparent 9.4% 13%, #0C0E16 13.5% 22%, transparent 22.5%),
            repeating-radial-gradient(circle, rgba(255,255,255,0.11) 0 1px, rgba(0,0,0,0.2) 2px 5px),
            conic-gradient(from 30deg, ${primaryColor}, #0A0B12 16%, ${secondaryColor} 34%, #0A0B12 52%, ${accentColor} 72%, #0A0B12 88%, ${primaryColor})
          `,
          boxShadow: `0 0 ${size * 0.18}px color-mix(in srgb, ${secondaryColor} 28%, transparent)`,
          transform: `translateX(${size * 0.15}px) rotate(${discRotation}deg) scale(${1 + energy * 0.022})`,
          opacity: 0.86,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: size * 0.84,
          height: size * 0.84,
          borderRadius: "50%",
          right: size * 0.04,
          border: "1px solid rgba(255,255,255,0.14)",
          opacity: 0.7,
          transform: `translateX(${size * 0.15}px)`,
        }}
      />
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          borderRadius: size * 0.038,
          overflow: "hidden",
          background: `linear-gradient(145deg, ${primaryColor}, ${secondaryColor} 56%, ${accentColor})`,
          border: "1px solid rgba(255,255,255,0.24)",
          boxShadow: `
            0 ${size * 0.075}px ${size * 0.17}px rgba(0,0,0,0.56),
            0 0 ${size * 0.13}px color-mix(in srgb, ${primaryColor} 24%, transparent)
          `,
          transform: `translateX(${-size * 0.075}px) translateY(${floatY}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${pulseScale})`,
          transformStyle: "preserve-3d",
        }}
      >
        {coverSrc ? (
          <Img
            src={coverSrc}
            style={{
              width: "100%",
              height: "100%",
              objectFit: coverFit,
              backgroundColor: "#090A10",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: size * 0.09,
              color: textColor,
              textAlign: "center",
              background: `
                radial-gradient(circle at 24% 18%, rgba(255,255,255,0.28), transparent 26%),
                linear-gradient(135deg, ${primaryColor}, ${secondaryColor} 54%, ${accentColor})
              `,
            }}
          >
            <div
              style={{
                fontSize: size * 0.25,
                fontWeight: 900,
                letterSpacing: -size * 0.012,
              }}
            >
              {getInitials(title)}
            </div>
            <div
              style={{
                marginTop: size * 0.06,
                fontSize: size * 0.052,
                fontWeight: 900,
                letterSpacing: 3,
              }}
            >
              {title.toUpperCase()}
            </div>
            <div
              style={{
                marginTop: size * 0.025,
                fontSize: size * 0.026,
                fontWeight: 700,
                letterSpacing: 2.2,
              }}
            >
              {artist.toUpperCase()}
            </div>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(112deg, transparent 18%, rgba(255,255,255,0.2) 42%, transparent 61%)",
            transform: `translateX(${Math.sin(frame / 50) * 18 - 42}%)`,
            mixBlendMode: "screen",
            opacity: 0.36,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          width: size * 0.7,
          height: size * 0.06,
          left: size * 0.08,
          bottom: size * 0.005,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.64)",
          filter: `blur(${size * 0.04}px)`,
          transform: `scaleX(${0.92 + energy * 0.08})`,
          opacity: 0.7,
        }}
      />
    </div>
  );
};
