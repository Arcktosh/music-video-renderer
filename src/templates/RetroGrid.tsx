import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {MusicVideoTemplateComponent} from './types';
import {
  ArtworkFrame,
  BrandMark,
  FONT_MONO,
  SpectrumBars,
  TemplateOutro,
  TemplateProgress,
  translucent,
} from './shared';

export const RetroGrid: MusicVideoTemplateComponent = ({runtime}) => {
  const isPortrait = runtime.layout === 'portrait';
  const isSquare = runtime.layout === 'square';
  const stacked = isPortrait || isSquare;
  const edge = isPortrait ? 42 : isSquare ? 48 : 62;
  const coverSize = isPortrait
    ? Math.min(runtime.width * 0.58, 560)
    : isSquare
      ? runtime.width * 0.37
      : Math.min(runtime.height * 0.5, runtime.width * 0.3);
  const titleBase = isPortrait ? 67 : isSquare ? 64 : 84;
  const titleSize = titleBase * (runtime.title.length > 19 ? 0.72 : runtime.title.length > 13 ? 0.86 : 1);
  const sunSize = isPortrait ? runtime.width * 0.5 : Math.min(runtime.width, runtime.height) * 0.42;

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background: runtime.backgroundColor,
        color: runtime.textColor,
        fontFamily: FONT_MONO,
      }}
    >
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${runtime.backgroundColor} 0%, ${translucent(
            runtime.secondaryColor,
            16,
          )} 52%, ${runtime.backgroundColor} 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: sunSize,
          height: sunSize,
          left: '50%',
          top: isPortrait ? '26%' : '16%',
          transform: `translateX(-50%) scale(${1 + runtime.bass * 0.06})`,
          borderRadius: '50%',
          background: `repeating-linear-gradient(0deg, ${runtime.accentColor} 0 18px, ${runtime.primaryColor} 18px 31px)`,
          boxShadow: `0 0 ${sunSize * 0.22}px ${translucent(runtime.primaryColor, 48)}`,
          opacity: 0.84,
          maskImage: 'linear-gradient(to bottom, black 0 66%, transparent 92%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '-18%',
          right: '-18%',
          bottom: '-43%',
          height: '78%',
          opacity: 0.45,
          transform: `perspective(760px) rotateX(64deg) translateY(${(runtime.frame % 56) - 56}px)`,
          transformOrigin: 'center bottom',
          backgroundImage: `repeating-linear-gradient(90deg, ${translucent(
            runtime.secondaryColor,
            58,
          )} 0 2px, transparent 2px 78px), repeating-linear-gradient(0deg, ${translucent(
            runtime.primaryColor,
            58,
          )} 0 2px, transparent 2px 72px)`,
          maskImage: 'linear-gradient(to top, black 28%, transparent 80%)',
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent 0 5px, ${translucent(
            '#FFFFFF',
            4,
          )} 5px 6px)`,
          mixBlendMode: 'screen',
          opacity: 0.8,
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
            color: runtime.accentColor,
            fontSize: isPortrait ? 10 : 12,
            fontWeight: 850,
            letterSpacing: 2.7,
            textShadow: `0 0 14px ${translucent(runtime.accentColor, 70)}`,
          }}
        >
          SYS: ONLINE / CH: 01
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: isPortrait ? '110px 40px 116px' : isSquare ? '106px 48px 110px' : '104px 68px 114px',
          display: 'flex',
          flexDirection: stacked ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: stacked ? (isPortrait ? 26 : 32) : 70,
          opacity: runtime.contentOpacity,
          zIndex: 3,
        }}
      >
        {runtime.showCover ? (
          <div
            style={{
              position: 'relative',
              padding: isPortrait ? 14 : 18,
              border: `2px solid ${runtime.secondaryColor}`,
              background: translucent(runtime.backgroundColor, 70),
              boxShadow: `0 0 32px ${translucent(runtime.secondaryColor, 36)}, inset 0 0 22px ${translucent(
                runtime.primaryColor,
                13,
              )}`,
              opacity: runtime.introProgress,
              transform: `translateY(${(1 - runtime.introProgress) * 46}px)`,
            }}
          >
            <ArtworkFrame runtime={runtime} size={coverSize} borderRadius={0} />
            <div
              style={{
                position: 'absolute',
                left: 10,
                right: 10,
                top: 10,
                display: 'flex',
                justifyContent: 'space-between',
                color: runtime.accentColor,
                fontSize: isPortrait ? 9 : 10,
                fontWeight: 850,
                letterSpacing: 1.8,
                textShadow: `0 0 8px ${runtime.accentColor}`,
              }}
            >
              <span>REC</span>
              <span>00:{Math.floor(runtime.frame / runtime.fps).toString().padStart(2, '0')}</span>
            </div>
          </div>
        ) : null}

        <div
          style={{
            width: stacked ? '100%' : Math.min(720, runtime.width * 0.41),
            maxWidth: stacked ? 830 : undefined,
            textAlign: stacked ? 'center' : 'left',
            opacity: runtime.introProgress,
            transform: `translate${stacked ? 'Y' : 'X'}(${(1 - runtime.introProgress) * 48}px)`,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              padding: '8px 12px',
              color: runtime.accentColor,
              border: `1px solid ${runtime.accentColor}`,
              background: translucent(runtime.accentColor, 7),
              fontSize: isPortrait ? 10 : 12,
              fontWeight: 850,
              letterSpacing: 2.6,
              boxShadow: `0 0 18px ${translucent(runtime.accentColor, 22)}`,
            }}
          >
            {runtime.eyebrow || 'NOW PLAYING'}
          </div>
          <div
            style={{
              marginTop: isPortrait ? 20 : 28,
              fontSize: titleSize,
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              textWrap: 'balance',
              color: runtime.textColor,
              textShadow: `3px 3px 0 ${runtime.primaryColor}, 0 0 24px ${translucent(
                runtime.secondaryColor,
                52,
              )}`,
            }}
          >
            {runtime.title}
          </div>
          <div
            style={{
              marginTop: 18,
              color: runtime.secondaryColor,
              fontSize: isPortrait ? 21 : 26,
              fontWeight: 850,
              letterSpacing: 4.4,
              textShadow: `0 0 14px ${translucent(runtime.secondaryColor, 55)}`,
            }}
          >
            {runtime.artist}
          </div>
          <div
            style={{
              marginTop: 10,
              color: runtime.mutedTextColor,
              fontSize: isPortrait ? 10 : 12,
              fontWeight: 750,
              letterSpacing: 2.3,
            }}
          >
            {runtime.catalogLabel}
          </div>
          <div style={{height: isPortrait ? 82 : 102, marginTop: isPortrait ? 22 : 30}}>
            <SpectrumBars runtime={runtime} height={isPortrait ? 82 : 102} blocky />
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
      <TemplateOutro runtime={runtime} treatment="retro" />
    </AbsoluteFill>
  );
};
