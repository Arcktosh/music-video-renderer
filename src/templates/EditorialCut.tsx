import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import type {MusicVideoTemplateComponent} from './types';
import {
  ArtworkFrame,
  BrandMark,
  FONT_MONO,
  FONT_SANS,
  FONT_SERIF,
  SpectrumBars,
  TemplateOutro,
  TemplateProgress,
  translucent,
} from './shared';

export const EditorialCut: MusicVideoTemplateComponent = ({runtime}) => {
  const isPortrait = runtime.layout === 'portrait';
  const isSquare = runtime.layout === 'square';
  const edge = isPortrait ? 48 : isSquare ? 52 : 70;
  const stacked = isPortrait || isSquare;
  const coverSize = isPortrait
    ? Math.min(runtime.width * 0.7, 670)
    : isSquare
      ? runtime.width * 0.4
      : Math.min(runtime.height * 0.66, runtime.width * 0.36);
  const titleBase = isPortrait ? 92 : isSquare ? 72 : 112;
  const titleSize = titleBase * (runtime.title.length > 22 ? 0.65 : runtime.title.length > 15 ? 0.8 : 1);
  const reveal = interpolate(runtime.frame, [0, runtime.fps * 1.05], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const issueNumber = `${Math.max(1, Math.floor(runtime.frame / runtime.fps) + 1)}`.padStart(2, '0');

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        backgroundColor: runtime.backgroundColor,
        color: runtime.textColor,
        fontFamily: FONT_SANS,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(90deg, ${translucent(runtime.textColor, 6)} 1px, transparent 1px), linear-gradient(${translucent(
            runtime.textColor,
            6,
          )} 1px, transparent 1px)`,
          backgroundSize: `${Math.max(66, runtime.width / 12)}px ${Math.max(66, runtime.height / 10)}px`,
          opacity: 0.72,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: isPortrait ? 18 : 24,
          background: runtime.primaryColor,
        }}
      />

      <AbsoluteFill style={{padding: edge, opacity: runtime.contentOpacity}}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `2px solid ${translucent(runtime.textColor, 32)}`,
            paddingBottom: isPortrait ? 18 : 20,
            opacity: reveal,
          }}
        >
          <BrandMark runtime={runtime} color={runtime.textColor} compact={stacked} />
          <div style={{display: 'flex', alignItems: 'center', gap: isPortrait ? 14 : 24}}>
            {!isPortrait ? (
              <div
                style={{
                  fontFamily: FONT_MONO,
                  color: runtime.mutedTextColor,
                  fontSize: isSquare ? 11 : 13,
                  fontWeight: 750,
                  letterSpacing: 2.2,
                }}
              >
                AUDIO EDITION / 2026
              </div>
            ) : null}
            <div
              style={{
                minWidth: isPortrait ? 42 : 50,
                textAlign: 'right',
                fontFamily: FONT_SERIF,
                fontSize: isPortrait ? 28 : 34,
                fontWeight: 700,
              }}
            >
              {issueNumber}
            </div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: stacked ? 'column' : 'row',
            gap: isPortrait ? 30 : isSquare ? 32 : 72,
            alignItems: stacked ? 'center' : 'center',
            justifyContent: 'center',
            padding: isPortrait ? '34px 0 140px' : isSquare ? '30px 0 108px' : '34px 0 104px',
          }}
        >
          <div
            style={{
              flex: stacked ? undefined : 1,
              order: stacked ? 1 : 0,
              width: stacked ? '100%' : undefined,
              minWidth: 0,
              textAlign: stacked ? 'center' : 'left',
              opacity: runtime.introProgress,
              transform: `translateX(${(1 - runtime.introProgress) * -48}px)`,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: stacked ? 'center' : 'flex-start',
                alignItems: 'center',
                gap: 12,
                fontFamily: FONT_MONO,
                fontSize: isPortrait ? 12 : 14,
                fontWeight: 850,
                letterSpacing: 2.7,
              }}
            >
              <span style={{width: 34, height: 4, background: runtime.primaryColor}} />
              {runtime.eyebrow || 'FEATURED RELEASE'}
            </div>
            <div
              style={{
                marginTop: isPortrait ? 20 : 30,
                fontFamily: FONT_SERIF,
                fontSize: titleSize,
                fontWeight: 700,
                fontStyle: 'italic',
                lineHeight: 0.82,
                letterSpacing: -4.5,
                textWrap: 'balance',
              }}
            >
              {runtime.title}
            </div>
            <div
              style={{
                marginTop: isPortrait ? 18 : 25,
                display: 'flex',
                justifyContent: stacked ? 'center' : 'flex-start',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                gap: isPortrait ? 10 : 16,
              }}
            >
              <span
                style={{
                  color: runtime.primaryColor,
                  fontSize: isPortrait ? 23 : isSquare ? 21 : 28,
                  fontWeight: 950,
                  letterSpacing: 1.2,
                }}
              >
                {runtime.artist}
              </span>
              <span
                style={{
                  color: runtime.mutedTextColor,
                  fontFamily: FONT_MONO,
                  fontSize: isPortrait ? 11 : 13,
                  fontWeight: 750,
                  letterSpacing: 2,
                }}
              >
                / {runtime.catalogLabel}
              </span>
            </div>
            <div style={{marginTop: isPortrait ? 20 : 30, width: '100%', height: isPortrait ? 70 : 82}}>
              <SpectrumBars runtime={runtime} height={isPortrait ? 70 : 82} mirrored colorMode="single" />
            </div>
          </div>

          {runtime.showCover ? (
            <div
              style={{
                order: stacked ? 0 : 1,
                position: 'relative',
                width: coverSize + (isPortrait ? 34 : 50),
                height: coverSize + (isPortrait ? 34 : 50),
                opacity: runtime.introProgress,
                transform: `translateY(${(1 - runtime.introProgress) * 42}px)`,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: isPortrait ? 22 : 32,
                  width: coverSize,
                  height: coverSize,
                  background: runtime.primaryColor,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  border: `5px solid ${runtime.textColor}`,
                }}
              >
                <ArtworkFrame runtime={runtime} size={coverSize} borderRadius={0} showShadow={false} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  right: -8,
                  bottom: -4,
                  color: runtime.primaryColor,
                  fontFamily: FONT_SERIF,
                  fontSize: isPortrait ? 84 : 112,
                  fontWeight: 700,
                  lineHeight: 0.72,
                  textShadow: `3px 3px 0 ${runtime.backgroundColor}`,
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
            bottom: isPortrait ? 38 : 40,
            display: 'flex',
            alignItems: 'flex-end',
            gap: isPortrait ? 18 : 34,
          }}
        >
          <div style={{flex: 1}}>
            <TemplateProgress runtime={runtime} compact={stacked} />
          </div>
          {!isPortrait ? (
            <div
              style={{
                color: runtime.mutedTextColor,
                fontFamily: FONT_MONO,
                fontSize: isSquare ? 10 : 12,
                fontWeight: 750,
                letterSpacing: 1.6,
                textAlign: 'right',
              }}
            >
              {runtime.website}
            </div>
          ) : null}
        </div>
      </AbsoluteFill>

      <TemplateOutro runtime={runtime} treatment="paper" />
    </AbsoluteFill>
  );
};
