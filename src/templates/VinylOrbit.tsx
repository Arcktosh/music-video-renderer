import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {MusicVideoRuntime, MusicVideoTemplateComponent} from './types';
import {
  ArtworkFrame,
  BrandMark,
  CircularSpectrum,
  FONT_MONO,
  FONT_SANS,
  TemplateOutro,
  TemplateProgress,
  translucent,
} from './shared';

const VinylRecord: React.FC<{runtime: MusicVideoRuntime; size: number}> = ({runtime, size}) => {
  const rotation = runtime.frame * 0.2;
  const scale = 0.9 + runtime.introProgress * 0.1 + runtime.bass * 0.025;

  return (
    <div
      style={{
        width: size * 1.24,
        height: size * 1.24,
        position: 'relative',
        flexShrink: 0,
        opacity: runtime.introProgress,
        transform: `translateY(${(1 - runtime.introProgress) * 58}px) scale(${scale})`,
      }}
    >
      <CircularSpectrum runtime={runtime} size={size * 1.24} radius={size * 0.54} />
      <div
        style={{
          position: 'absolute',
          width: size,
          height: size,
          left: '50%',
          top: '50%',
          marginLeft: -size / 2,
          marginTop: -size / 2,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at center, #101010 0 7%, #332326 7.4% 8.2%, #070707 8.6% 24%, #22191B 24.5% 25%, #050505 25.4% 41%, #1D1718 41.5% 42%, #030303 42.4% 100%)',
          boxShadow: `0 ${size * 0.09}px ${size * 0.19}px rgba(0,0,0,0.56), 0 0 ${size * 0.2}px ${translucent(
            runtime.primaryColor,
            20 + runtime.bass * 25,
          )}`,
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: size * 0.025,
            borderRadius: '50%',
            backgroundImage: `repeating-radial-gradient(circle, transparent 0 4px, ${translucent(
              '#FFFFFF',
              5,
            )} 4px 5px)`,
            mixBlendMode: 'screen',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: size * 0.36,
            height: size * 0.36,
            left: '50%',
            top: '50%',
            marginLeft: -size * 0.18,
            marginTop: -size * 0.18,
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: `0 0 0 ${size * 0.012}px ${runtime.primaryColor}, 0 0 0 ${size * 0.022}px ${translucent(
              runtime.textColor,
              18,
            )}`,
          }}
        >
          <ArtworkFrame
            runtime={runtime}
            size={size * 0.36}
            borderRadius="50%"
            showShadow={false}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            width: size * 0.025,
            height: size * 0.025,
            left: '50%',
            top: '50%',
            marginLeft: -size * 0.0125,
            marginTop: -size * 0.0125,
            borderRadius: '50%',
            background: '#E7DED4',
            boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
          }}
        />
      </div>
    </div>
  );
};

export const VinylOrbit: MusicVideoTemplateComponent = ({runtime}) => {
  const isPortrait = runtime.layout === 'portrait';
  const isSquare = runtime.layout === 'square';
  const stacked = isPortrait || isSquare;
  const edge = isPortrait ? 44 : isSquare ? 52 : 66;
  const recordSize = isPortrait
    ? Math.min(runtime.width * 0.67, runtime.height * 0.34)
    : isSquare
      ? runtime.width * 0.48
      : Math.min(runtime.height * 0.58, runtime.width * 0.35);
  const titleSize = isPortrait ? 74 : isSquare ? 64 : 88;

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background: runtime.backgroundColor,
        color: runtime.textColor,
        fontFamily: FONT_SANS,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 18% 20%, ${translucent(
            runtime.primaryColor,
            26 + runtime.bass * 15,
          )}, transparent 40%), radial-gradient(circle at 82% 78%, ${translucent(
            runtime.accentColor,
            22 + runtime.energy * 14,
          )}, transparent 44%), ${runtime.backgroundColor}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: Math.min(runtime.width, runtime.height) * 0.94,
          height: Math.min(runtime.width, runtime.height) * 0.94,
          right: -Math.min(runtime.width, runtime.height) * 0.28,
          top: -Math.min(runtime.width, runtime.height) * 0.26,
          borderRadius: '50%',
          border: `1px solid ${translucent(runtime.textColor, 9)}`,
          boxShadow: `inset 0 0 0 52px ${translucent(runtime.textColor, 2)}, inset 0 0 0 104px ${translucent(
            runtime.textColor,
            1.7,
          )}`,
          transform: `rotate(${runtime.frame * 0.08}deg)`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: edge,
          right: edge,
          top: isPortrait ? 40 : 46,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: runtime.chromeOpacity,
          zIndex: 5,
        }}
      >
        <BrandMark runtime={runtime} compact={stacked} />
        <div
          style={{
            color: runtime.mutedTextColor,
            fontFamily: FONT_MONO,
            fontSize: isPortrait ? 11 : 13,
            fontWeight: 800,
            letterSpacing: 3,
          }}
        >
          ANALOG VISUAL / 33⅓ RPM
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: isPortrait ? '106px 38px 112px' : isSquare ? '100px 46px 106px' : '96px 72px 104px',
          display: 'flex',
          flexDirection: stacked ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: stacked ? (isPortrait ? 22 : 16) : 86,
          opacity: runtime.contentOpacity,
        }}
      >
        {runtime.showCover ? <VinylRecord runtime={runtime} size={recordSize} /> : null}

        <div
          style={{
            width: stacked ? '100%' : Math.min(650, runtime.width * 0.38),
            maxWidth: stacked ? 820 : undefined,
            display: 'flex',
            flexDirection: 'column',
            alignItems: stacked ? 'center' : 'flex-start',
            textAlign: stacked ? 'center' : 'left',
            opacity: runtime.introProgress,
            transform: `translate${stacked ? 'Y' : 'X'}(${(1 - runtime.introProgress) * 46}px)`,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              padding: '9px 14px',
              border: `1px solid ${translucent(runtime.primaryColor, 55)}`,
              borderRadius: 999,
              color: runtime.primaryColor,
              background: translucent(runtime.primaryColor, 8),
              fontFamily: FONT_MONO,
              fontSize: isPortrait ? 11 : 13,
              fontWeight: 850,
              letterSpacing: 2.8,
            }}
          >
            {runtime.eyebrow || 'NOW SPINNING'}
          </div>
          <div
            style={{
              marginTop: isPortrait ? 18 : 27,
              fontSize: titleSize * (runtime.title.length > 18 ? 0.78 : runtime.title.length > 13 ? 0.9 : 1),
              fontWeight: 950,
              letterSpacing: -4,
              lineHeight: 0.86,
              textWrap: 'balance',
            }}
          >
            {runtime.title}
          </div>
          <div
            style={{
              marginTop: 18,
              color: runtime.accentColor,
              fontSize: isPortrait ? 24 : 29,
              fontWeight: 850,
              letterSpacing: 4.6,
            }}
          >
            {runtime.artist}
          </div>
          <div
            style={{
              marginTop: 11,
              color: runtime.mutedTextColor,
              fontFamily: FONT_MONO,
              fontSize: isPortrait ? 11 : 13,
              fontWeight: 750,
              letterSpacing: 2.3,
            }}
          >
            {runtime.catalogLabel}
          </div>
          <div
            style={{
              width: stacked ? Math.min(470, runtime.width * 0.64) : '100%',
              height: 1,
              marginTop: isPortrait ? 22 : 30,
              background: `linear-gradient(90deg, transparent, ${translucent(
                runtime.textColor,
                30,
              )}, transparent)`,
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: edge,
          right: edge,
          bottom: isPortrait ? 36 : 34,
          opacity: runtime.contentOpacity,
        }}
      >
        <TemplateProgress runtime={runtime} compact={stacked} />
      </div>

      <TemplateOutro runtime={runtime} treatment="vinyl" />
    </AbsoluteFill>
  );
};
