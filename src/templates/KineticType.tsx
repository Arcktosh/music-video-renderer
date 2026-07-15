import React from 'react';
import {AbsoluteFill} from 'remotion';
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

export const KineticType: MusicVideoTemplateComponent = ({runtime}) => {
  const isPortrait = runtime.layout === 'portrait';
  const isSquare = runtime.layout === 'square';
  const stacked = isPortrait || isSquare;
  const edge = isPortrait ? 42 : isSquare ? 48 : 58;
  const coverSize = isPortrait
    ? Math.min(runtime.width * 0.46, 430)
    : isSquare
      ? runtime.width * 0.34
      : Math.min(runtime.height * 0.38, runtime.width * 0.24);
  const titleBase = isPortrait ? 92 : isSquare ? 86 : 126;
  const titleSize = titleBase * (runtime.title.length > 20 ? 0.68 : runtime.title.length > 14 ? 0.82 : 1);
  const beat = runtime.bass * 44;

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
          backgroundImage: `linear-gradient(${translucent('#FFFFFF', 4)} 1px, transparent 1px), linear-gradient(90deg, ${translucent(
            '#FFFFFF',
            4,
          )} 1px, transparent 1px)`,
          backgroundSize: isPortrait ? '66px 66px' : '92px 92px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: isPortrait ? '62%' : '40%',
          height: isPortrait ? '24%' : '52%',
          left: -38 - beat,
          top: isPortrait ? '12%' : '18%',
          background: runtime.primaryColor,
          transform: `skewX(-8deg) translateX(${Math.sin(runtime.frame / 28) * 18}px)`,
          opacity: 0.86,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: isPortrait ? '70%' : '36%',
          height: isPortrait ? '21%' : '58%',
          right: -38 - beat,
          bottom: isPortrait ? '17%' : '8%',
          background: runtime.accentColor,
          transform: `skewX(7deg) translateX(${Math.cos(runtime.frame / 32) * 20}px)`,
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -20,
          right: -20,
          top: isPortrait ? '43%' : '46%',
          fontSize: isPortrait ? 134 : 188,
          fontWeight: 950,
          letterSpacing: -9,
          lineHeight: 0.75,
          whiteSpace: 'nowrap',
          color: translucent(runtime.textColor, 6),
          transform: `translateX(${-(runtime.frame * 1.7) % 520}px) rotate(-3deg)`,
        }}
      >
        {`${runtime.title} · ${runtime.title} · ${runtime.title} ·`}
      </div>

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
          zIndex: 6,
        }}
      >
        <BrandMark runtime={runtime} compact={stacked} />
        <div
          style={{
            background: runtime.accentColor,
            color: runtime.backgroundColor,
            padding: isPortrait ? '8px 11px' : '10px 15px',
            fontFamily: FONT_MONO,
            fontSize: isPortrait ? 10 : 12,
            fontWeight: 950,
            letterSpacing: 2.6,
          }}
        >
          LIVE AUDIO / 001
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: isPortrait ? '108px 42px 116px' : isSquare ? '104px 48px 112px' : '102px 64px 114px',
          display: 'flex',
          flexDirection: stacked ? 'column' : 'row',
          justifyContent: 'center',
          alignItems: stacked ? 'stretch' : 'center',
          gap: stacked ? (isPortrait ? 28 : 36) : 74,
          opacity: runtime.contentOpacity,
          zIndex: 3,
        }}
      >
        <div
          style={{
            flex: stacked ? undefined : 1,
            opacity: runtime.introProgress,
            transform: `translateX(${(1 - runtime.introProgress) * -62}px)`,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              background: runtime.textColor,
              color: runtime.backgroundColor,
              padding: '9px 13px',
              fontFamily: FONT_MONO,
              fontSize: isPortrait ? 11 : 13,
              fontWeight: 950,
              letterSpacing: 2.8,
              transform: 'rotate(-1.5deg)',
            }}
          >
            {runtime.eyebrow || 'NEW RELEASE'}
          </div>
          <div
            style={{
              marginTop: isPortrait ? 26 : 34,
              fontSize: titleSize,
              fontWeight: 950,
              letterSpacing: isPortrait ? -6 : -8,
              lineHeight: 0.75,
              textTransform: 'uppercase',
              textWrap: 'balance',
              textShadow: `${Math.max(5, beat * 0.2)}px ${Math.max(5, beat * 0.2)}px 0 ${translucent(
                runtime.primaryColor,
                52,
              )}`,
            }}
          >
            {runtime.title}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginTop: isPortrait ? 22 : 28,
              fontSize: isPortrait ? 23 : 29,
              fontWeight: 950,
              letterSpacing: 4.6,
            }}
          >
            <span style={{width: isPortrait ? 34 : 52, height: 7, background: runtime.accentColor}} />
            {runtime.artist}
          </div>
          <div
            style={{
              maxWidth: stacked ? '100%' : 750,
              height: isPortrait ? 82 : 106,
              marginTop: isPortrait ? 24 : 34,
            }}
          >
            <SpectrumBars runtime={runtime} height={isPortrait ? 82 : 106} blocky />
          </div>
        </div>

        {runtime.showCover ? (
          <div
            style={{
              width: coverSize + 36,
              height: coverSize + 36,
              position: 'relative',
              flexShrink: 0,
              alignSelf: stacked ? 'center' : undefined,
              opacity: runtime.introProgress,
              transform: `rotate(${Math.sin(runtime.frame / 44) * 1.8}deg) scale(${0.92 + runtime.introProgress * 0.08 + runtime.bass * 0.035})`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: runtime.accentColor,
                transform: `translate(${15 + runtime.energy * 10}px, ${15 + runtime.energy * 10}px)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                border: `8px solid ${runtime.textColor}`,
                overflow: 'hidden',
              }}
            >
              <ArtworkFrame runtime={runtime} size={coverSize + 36} borderRadius={0} showShadow={false} />
            </div>
            <div
              style={{
                position: 'absolute',
                right: -20,
                top: -19,
                width: 62,
                height: 62,
                borderRadius: '50%',
                background: runtime.primaryColor,
                border: `6px solid ${runtime.textColor}`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: FONT_MONO,
                fontSize: 17,
                fontWeight: 950,
              }}
            >
              01
            </div>
          </div>
        ) : null}
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
      <TemplateOutro runtime={runtime} treatment="bold" />
    </AbsoluteFill>
  );
};
