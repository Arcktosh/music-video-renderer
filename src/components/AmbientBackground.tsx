import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';

type AmbientBackgroundProps = {
  frame: number;
  energy: number;
  bass: number;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
};

const colorWithTransparency = (color: string, percentage: number) =>
  `color-mix(in srgb, ${color} ${percentage}%, transparent)`;

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({
  frame,
  energy,
  bass,
  backgroundColor,
  primaryColor,
  secondaryColor,
  accentColor,
}) => {
  const driftX = Math.sin(frame / 54) * 5;
  const driftY = Math.cos(frame / 67) * 4;
  const pulse = 1 + bass * 0.16;
  const rotation = frame * 0.07;

  return (
    <AbsoluteFill style={{backgroundColor, overflow: 'hidden'}}>
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
