import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

type AmbientBackgroundProps = {
  frame: number;
  energy: number;
  bass: number;
  backgroundColor: string;
  backgroundImageSrc: string;
  backgroundImageFit: 'cover' | 'contain';
  backgroundImageOpacity: number;
  backgroundImageEffect: 'none' | 'glitch';
  backgroundGlitchIntensity: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
};

const colorWithTransparency = (color: string, percentage: number) =>
  `color-mix(in srgb, ${color} ${percentage}%, transparent)`;

const glitchSlices = [
  {top: 7, bottom: 71, direction: -1, hue: -28},
  {top: 34, bottom: 45, direction: 1, hue: 34},
  {top: 68, bottom: 13, direction: -0.62, hue: 86},
] as const;

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  frame,
  energy,
  bass,
  backgroundColor,
  backgroundImageSrc,
  backgroundImageFit,
  backgroundImageOpacity,
  backgroundImageEffect,
  backgroundGlitchIntensity,
  primaryColor,
  secondaryColor,
  accentColor,
}) => {
  const driftX = Math.sin(frame / 54) * 5;
  const driftY = Math.cos(frame / 67) * 4;
  const pulse = 1 + bass * 0.16;
  const rotation = frame * 0.07;
  const glitchEnabled =
    backgroundImageEffect === 'glitch' &&
    backgroundImageSrc.length > 0 &&
    backgroundGlitchIntensity > 0;
  const burstPhaseA = frame % 97;
  const burstPhaseB = frame % 173;
  const glitchBurst =
    glitchEnabled && (burstPhaseA < 7 || (burstPhaseB >= 71 && burstPhaseB < 76));
  const glitchPulse = glitchBurst
    ? Math.min(1, (0.38 + energy * 0.62) * backgroundGlitchIntensity)
    : 0;
  const glitchDirection = Math.sin(frame * 1.91) >= 0 ? 1 : -1;
  const glitchOffset = glitchDirection * (10 + bass * 26) * glitchPulse;
  const imageScale = 1.025 + bass * 0.012;

  return (
    <AbsoluteFill style={{backgroundColor, overflow: 'hidden'}}>
      {backgroundImageSrc ? (
        <AbsoluteFill style={{overflow: 'hidden'}}>
          <Img
            src={backgroundImageSrc}
            style={{
              width: '100%',
              height: '100%',
              objectFit: backgroundImageFit,
              opacity: backgroundImageOpacity,
              transform: `scale(${imageScale})`,
              filter: 'brightness(0.74) saturate(112%) contrast(104%)',
            }}
          />

          {glitchBurst
            ? glitchSlices.map((slice, index) => (
                <Img
                  key={index}
                  src={backgroundImageSrc}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: backgroundImageFit,
                    clipPath: `inset(${slice.top}% 0 ${slice.bottom}% 0)`,
                    opacity: Math.min(
                      0.78,
                      backgroundImageOpacity * (0.34 + glitchPulse * 0.58),
                    ),
                    transform: `translateX(${glitchOffset * slice.direction}px) scale(${imageScale + 0.006})`,
                    filter: `brightness(0.92) saturate(185%) hue-rotate(${slice.hue}deg)`,
                    mixBlendMode: 'screen',
                  }}
                />
              ))
            : null}

          {glitchBurst ? (
            <>
              <AbsoluteFill
                style={{
                  transform: `translateX(${-glitchOffset * 0.42}px)`,
                  background: `linear-gradient(
                    to bottom,
                    transparent 0%,
                    transparent 44%,
                    ${colorWithTransparency(primaryColor, 18)} 44%,
                    ${colorWithTransparency(secondaryColor, 20)} 47%,
                    transparent 47%,
                    transparent 100%
                  )`,
                  opacity: 0.45 * glitchPulse,
                  mixBlendMode: 'screen',
                }}
              />
              <AbsoluteFill
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent 0 7px, rgba(255,255,255,0.045) 7px 8px)',
                  opacity: 0.5 * glitchPulse,
                  transform: `translateY(${(frame % 9) - 4}px)`,
                  mixBlendMode: 'overlay',
                }}
              />
            </>
          ) : null}
        </AbsoluteFill>
      ) : null}

      <AbsoluteFill
        style={{
          inset: '-32%',
          opacity: 0.42 + energy * 0.2,
          transform: `translate(${driftX}%, ${driftY}%) rotate(${rotation}deg) scale(${pulse})`,
          background: `conic-gradient(
            from 40deg,
            ${colorWithTransparency(primaryColor, 68)},
            transparent 22%,
            ${colorWithTransparency(secondaryColor, 55)} 43%,
            transparent 62%,
            ${colorWithTransparency(accentColor, 54)} 82%,
            ${colorWithTransparency(primaryColor, 68)}
          )`,
          filter: 'blur(110px) saturate(128%)',
          mixBlendMode: 'screen',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: '58%',
          aspectRatio: '1 / 1',
          left: `${-8 + Math.sin(frame / 74) * 5}%`,
          top: `${-18 + Math.cos(frame / 81) * 4}%`,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colorWithTransparency(primaryColor, 72)} 0%, transparent 68%)`,
          filter: 'blur(70px)',
          opacity: 0.34 + bass * 0.28,
          transform: `scale(${1 + bass * 0.22})`,
          mixBlendMode: 'screen',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: '52%',
          aspectRatio: '1 / 1',
          right: `${-9 + Math.cos(frame / 62) * 4}%`,
          bottom: `${-22 + Math.sin(frame / 93) * 4}%`,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colorWithTransparency(secondaryColor, 70)} 0%, transparent 70%)`,
          filter: 'blur(76px)',
          opacity: 0.28 + energy * 0.24,
          transform: `scale(${1 + energy * 0.18})`,
          mixBlendMode: 'screen',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: '38%',
          aspectRatio: '1 / 1',
          left: '38%',
          top: '33%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colorWithTransparency(accentColor, 56)} 0%, transparent 70%)`,
          filter: 'blur(94px)',
          opacity: 0.15 + bass * 0.18,
          transform: `translateY(${Math.sin(frame / 45) * 22}px) scale(${1 + bass * 0.12})`,
          mixBlendMode: 'screen',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: '-15%',
          right: '-15%',
          bottom: '-48%',
          height: '82%',
          opacity: 0.18,
          transform: `perspective(900px) rotateX(64deg) translateY(${(frame % 60) - 60}px)`,
          transformOrigin: 'center bottom',
          backgroundImage: `
            repeating-linear-gradient(90deg, ${colorWithTransparency(secondaryColor, 30)} 0 1px, transparent 1px 78px),
            repeating-linear-gradient(0deg, ${colorWithTransparency(primaryColor, 28)} 0 1px, transparent 1px 78px)
          `,
          maskImage: 'linear-gradient(to top, black 25%, transparent 78%)',
        }}
      />

      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at center, transparent 22%, rgba(0,0,0,0.18) 62%, rgba(0,0,0,0.74) 118%)',
        }}
      />

      <AbsoluteFill
        style={{
          backgroundImage: `url("${staticFile('noise.png')}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
          opacity: 0.08,
          mixBlendMode: 'soft-light',
        }}
      />
    </AbsoluteFill>
  );
};
