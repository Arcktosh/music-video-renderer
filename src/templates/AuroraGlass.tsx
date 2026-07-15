import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AmbientBackground} from '../components/AmbientBackground';
import type {MusicVideoTemplateComponent} from './types';
import {
  ArtworkFrame,
  BrandMark,
  FONT_MONO,
  FONT_SANS,
  SpectrumBars,
  TemplateOutro,
  TemplateProgress,
  translucent,
} from './shared';

export const AuroraGlass: MusicVideoTemplateComponent = ({runtime}) => {
  const isPortrait = runtime.layout === 'portrait';
  const isSquare = runtime.layout === 'square';
  const stacked = isPortrait || isSquare;
  const edge = isPortrait ? 44 : isSquare ? 50 : 68;
  const coverSize = isPortrait
    ? Math.min(runtime.width * 0.64, 620)
    : isSquare
      ? runtime.width * 0.38
      : Math.min(runtime.height * 0.56, runtime.width * 0.32);
  const titleBase = isPortrait ? 70 : isSquare ? 66 : 88;
  const titleSize = titleBase * (runtime.title.length > 20 ? 0.72 : runtime.title.length > 14 ? 0.86 : 1);

  const glassStyle: React.CSSProperties = {
    background: `linear-gradient(145deg, ${translucent(runtime.textColor, 10)}, ${translucent(
      runtime.backgroundColor,
      36,
    )})`,
    border: `1px solid ${translucent(runtime.textColor, 20)}`,
    boxShadow: `0 34px 100px rgba(0,0,0,0.34), inset 0 1px 0 ${translucent(runtime.textColor, 14)}`,
    backdropFilter: 'blur(28px) saturate(132%)',
  };

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background: runtime.backgroundColor,
        color: runtime.textColor,
        fontFamily: FONT_SANS,
      }}
    >
      <AmbientBackground
        frame={runtime.frame}
        energy={runtime.energy}
        bass={runtime.bass}
        backgroundColor={runtime.backgroundColor}
        primaryColor={runtime.primaryColor}
        secondaryColor={runtime.secondaryColor}
        accentColor={runtime.accentColor}
      />
      <div
        style={{
          position: 'absolute',
          width: Math.min(runtime.width, runtime.height) * 0.55,
          height: Math.min(runtime.width, runtime.height) * 0.55,
          left: isPortrait ? '-20%' : '-7%',
          top: isPortrait ? '26%' : '18%',
          borderRadius: '50%',
          border: `1px solid ${translucent(runtime.secondaryColor, 22)}`,
          transform: `rotate(${runtime.frame * 0.08}deg) scale(${1 + runtime.energy * 0.08})`,
          boxShadow: `inset 0 0 80px ${translucent(runtime.secondaryColor, 10)}`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: edge,
          right: edge,
          top: isPortrait ? 38 : 44,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: runtime.chromeOpacity,
          zIndex: 5,
        }}
      >
        <BrandMark runtime={runtime} compact={stacked} boxed />
        <div
          style={{
            ...glassStyle,
            borderRadius: 999,
            padding: isPortrait ? '9px 12px' : '10px 15px',
            color: runtime.mutedTextColor,
            fontFamily: FONT_MONO,
            fontSize: isPortrait ? 10 : 12,
            fontWeight: 850,
            letterSpacing: 2.7,
          }}
        >
          AURORA SESSION / 001
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: isPortrait ? '108px 38px 116px' : isSquare ? '104px 46px 110px' : '102px 66px 112px',
          display: 'flex',
          flexDirection: stacked ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: stacked ? (isPortrait ? 26 : 34) : 54,
          opacity: runtime.contentOpacity,
        }}
      >
        {runtime.showCover ? (
          <div
            style={{
              ...glassStyle,
              padding: isPortrait ? 22 : 28,
              borderRadius: isPortrait ? 34 : 38,
              position: 'relative',
              flexShrink: 0,
              opacity: runtime.introProgress,
              transform: `translateY(${(1 - runtime.introProgress) * 48}px) rotate(${Math.sin(runtime.frame / 75) * 0.7}deg)`,
            }}
          >
            <ArtworkFrame runtime={runtime} size={coverSize} borderRadius={coverSize * 0.06} />
            <div
              style={{
                position: 'absolute',
                inset: -18,
                borderRadius: isPortrait ? 42 : 46,
                border: `1px solid ${translucent(runtime.secondaryColor, 18 + runtime.energy * 18)}`,
                pointerEvents: 'none',
              }}
            />
          </div>
        ) : null}

        <div
          style={{
            ...glassStyle,
            width: stacked ? '100%' : Math.min(700, runtime.width * 0.4),
            maxWidth: stacked ? 840 : undefined,
            padding: isPortrait ? '30px 30px 28px' : isSquare ? '34px 36px 32px' : '46px 48px 40px',
            borderRadius: isPortrait ? 32 : 38,
            textAlign: stacked ? 'center' : 'left',
            opacity: runtime.introProgress,
            transform: `translate${stacked ? 'Y' : 'X'}(${(1 - runtime.introProgress) * 46}px)`,
          }}
        >
          <div
            style={{
              color: runtime.secondaryColor,
              fontFamily: FONT_MONO,
              fontSize: isPortrait ? 11 : 13,
              fontWeight: 850,
              letterSpacing: 3,
            }}
          >
            {runtime.eyebrow || 'NOW PLAYING'}
          </div>
          <div
            style={{
              marginTop: isPortrait ? 18 : 25,
              fontSize: titleSize,
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: -3.8,
              textWrap: 'balance',
              textShadow: `0 14px 48px ${translucent(runtime.primaryColor, 24)}`,
            }}
          >
            {runtime.title}
          </div>
          <div
            style={{
              marginTop: 18,
              color: runtime.textColor,
              fontSize: isPortrait ? 23 : 28,
              fontWeight: 820,
              letterSpacing: 4.4,
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
              letterSpacing: 2.2,
            }}
          >
            {runtime.catalogLabel}
          </div>
          <div style={{height: isPortrait ? 82 : 102, marginTop: isPortrait ? 22 : 30}}>
            <SpectrumBars runtime={runtime} height={isPortrait ? 82 : 102} mirrored />
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: edge,
          right: edge,
          bottom: isPortrait ? 35 : 33,
          opacity: runtime.contentOpacity,
        }}
      >
        <TemplateProgress runtime={runtime} compact={stacked} />
      </div>
      <TemplateOutro runtime={runtime} treatment="glass" />
    </AbsoluteFill>
  );
};
