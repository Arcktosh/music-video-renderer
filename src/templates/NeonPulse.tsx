import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AmbientBackground} from '../components/AmbientBackground';
import {AudioSpectrum} from '../components/AudioSpectrum';
import {BrandChrome} from '../components/BrandChrome';
import {CoverStage} from '../components/CoverStage';
import {OutroCard} from '../components/OutroCard';
import {ProgressRail} from '../components/ProgressRail';
import {TrackInfo} from '../components/TrackInfo';
import type {MusicVideoTemplateComponent} from './types';

export const NeonPulse: MusicVideoTemplateComponent = ({runtime}) => {
  const {
    frame,
    fps,
    width,
    height,
    layout,
    compact,
    coverSrc,
    logoSrc,
    audioDurationInFrames,
    spectrum,
    bass,
    energy,
    introProgress,
    contentOpacity,
    chromeOpacity,
    safeX,
    safeY,
  } = runtime;
  const borderInset = layout === 'portrait' ? 34 : 30;
  const progressBottom = layout === 'portrait' ? 104 : layout === 'square' ? 72 : 76;
  const spectrumBottom = layout === 'portrait' ? 172 : layout === 'square' ? 120 : 128;
  const spectrumHeight = layout === 'portrait' ? 208 : layout === 'square' ? 130 : 166;

  return (
    <AbsoluteFill style={{backgroundColor: runtime.backgroundColor, color: runtime.textColor, overflow: 'hidden'}}>
      <AmbientBackground
        frame={frame}
        energy={energy}
        bass={bass}
        backgroundColor={runtime.backgroundColor}
        primaryColor={runtime.primaryColor}
        secondaryColor={runtime.secondaryColor}
        accentColor={runtime.accentColor}
      />

      <div
        style={{
          position: 'absolute',
          inset: borderInset,
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: layout === 'portrait' ? 34 : 28,
          pointerEvents: 'none',
          opacity: 0.72,
        }}
      />

      <BrandChrome
        logoSrc={logoSrc}
        brandName={runtime.brandName}
        eyebrow={runtime.eyebrow}
        catalogLabel={runtime.catalogLabel}
        copyrightLine={runtime.copyrightLine}
        textColor={runtime.textColor}
        mutedTextColor={runtime.mutedTextColor}
        primaryColor={runtime.primaryColor}
        safeX={safeX}
        safeY={safeY}
        compact={compact}
        opacity={chromeOpacity}
      />

      {layout === 'portrait' ? (
        <div
          style={{
            position: 'absolute',
            left: safeX,
            right: safeX,
            top: 220,
            bottom: 410,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: contentOpacity,
          }}
        >
          {runtime.showCover ? (
            <CoverStage
              coverSrc={coverSrc}
              coverFit={runtime.coverFit}
              title={runtime.title}
              artist={runtime.artist}
              frame={frame}
              size={Math.min(width * 0.64, 650)}
              bass={bass}
              energy={energy}
              primaryColor={runtime.primaryColor}
              secondaryColor={runtime.secondaryColor}
              accentColor={runtime.accentColor}
              textColor={runtime.textColor}
              introProgress={introProgress}
            />
          ) : null}
          <div style={{width: '100%', marginTop: runtime.showCover ? 76 : 260}}>
            <TrackInfo
              title={runtime.title}
              artist={runtime.artist}
              website={runtime.website}
              layout={layout}
              introProgress={introProgress}
              energy={energy}
              textColor={runtime.textColor}
              mutedTextColor={runtime.mutedTextColor}
              primaryColor={runtime.primaryColor}
              secondaryColor={runtime.secondaryColor}
              accentColor={runtime.accentColor}
            />
          </div>
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            left: safeX,
            right: safeX,
            top: layout === 'square' ? 166 : 154,
            bottom: layout === 'square' ? 278 : 258,
            display: 'flex',
            alignItems: 'center',
            justifyContent: runtime.showCover ? 'space-between' : 'center',
            gap: layout === 'square' ? 28 : 76,
            opacity: contentOpacity,
          }}
        >
          <div
            style={{
              width: runtime.showCover ? (layout === 'square' ? '48%' : '49%') : '72%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: runtime.showCover ? 'flex-start' : 'center',
            }}
          >
            <TrackInfo
              title={runtime.title}
              artist={runtime.artist}
              website={runtime.website}
              layout={layout}
              introProgress={introProgress}
              energy={energy}
              textColor={runtime.textColor}
              mutedTextColor={runtime.mutedTextColor}
              primaryColor={runtime.primaryColor}
              secondaryColor={runtime.secondaryColor}
              accentColor={runtime.accentColor}
            />
          </div>

          {runtime.showCover ? (
            <div
              style={{
                width: layout === 'square' ? '48%' : '46%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <CoverStage
                coverSrc={coverSrc}
                coverFit={runtime.coverFit}
                title={runtime.title}
                artist={runtime.artist}
                frame={frame}
                size={layout === 'square' ? Math.min(width * 0.38, 420) : Math.min(height * 0.53, 560)}
                bass={bass}
                energy={energy}
                primaryColor={runtime.primaryColor}
                secondaryColor={runtime.secondaryColor}
                accentColor={runtime.accentColor}
                textColor={runtime.textColor}
                introProgress={introProgress}
              />
            </div>
          ) : null}
        </div>
      )}

      {runtime.showVisualizer ? (
        <div
          style={{
            position: 'absolute',
            left: safeX,
            right: safeX,
            bottom: spectrumBottom,
            opacity: contentOpacity,
          }}
        >
          <AudioSpectrum
            values={spectrum}
            intensity={runtime.intensity}
            primaryColor={runtime.primaryColor}
            secondaryColor={runtime.secondaryColor}
            accentColor={runtime.accentColor}
            maxHeight={spectrumHeight}
            opacity={0.76 + energy * 0.24}
          />
        </div>
      ) : null}

      {runtime.showProgress ? (
        <div
          style={{
            position: 'absolute',
            left: safeX,
            right: safeX,
            bottom: progressBottom,
            opacity: contentOpacity,
          }}
        >
          <ProgressRail
            frame={frame}
            audioDurationInFrames={audioDurationInFrames}
            fps={fps}
            showTimecode={runtime.showTimecode}
            textColor={runtime.textColor}
            mutedTextColor={runtime.mutedTextColor}
            primaryColor={runtime.primaryColor}
            secondaryColor={runtime.secondaryColor}
            accentColor={runtime.accentColor}
            compact={compact}
          />
        </div>
      ) : null}

      <OutroCard
        frame={frame}
        startFrame={runtime.outroStartFrame}
        logoSrc={logoSrc}
        brandName={runtime.brandName}
        title={runtime.title}
        artist={runtime.artist}
        callToAction={runtime.callToAction}
        website={runtime.website}
        textColor={runtime.textColor}
        mutedTextColor={runtime.mutedTextColor}
        primaryColor={runtime.primaryColor}
        secondaryColor={runtime.secondaryColor}
        accentColor={runtime.accentColor}
      />
    </AbsoluteFill>
  );
};
