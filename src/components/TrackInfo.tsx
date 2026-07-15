import React from 'react';

type TrackInfoProps = {
  title: string;
  artist: string;
  website: string;
  layout: 'wide' | 'square' | 'portrait';
  introProgress: number;
  energy: number;
  textColor: string;
  mutedTextColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
};

const getTitleSize = (title: string, layout: TrackInfoProps['layout']) => {
  const base = layout === 'wide' ? 116 : layout === 'square' ? 78 : 106;
  const minimum = layout === 'wide' ? 66 : layout === 'square' ? 50 : 68;
  const threshold = layout === 'wide' ? 14 : layout === 'square' ? 12 : 15;
  const penalty = Math.max(0, title.length - threshold) * (layout === 'square' ? 1.7 : 2.05);

  return Math.max(minimum, base - penalty);
};

export const TrackInfo: React.FC<TrackInfoProps> = ({
  title,
  artist,
  website,
  layout,
  introProgress,
  energy,
  textColor,
  mutedTextColor,
  primaryColor,
  secondaryColor,
  accentColor,
}) => {
  const titleSize = getTitleSize(title, layout);
  const translateY = (1 - introProgress) * (layout === 'portrait' ? 70 : 54);
  const maxWidth = layout === 'wide' ? 760 : layout === 'square' ? 470 : 910;

  return (
    <div
      style={{
        width: '100%',
        maxWidth,
        color: textColor,
        opacity: introProgress,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          padding: layout === 'portrait' ? '12px 18px' : '10px 16px',
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.17)',
          background: 'rgba(255,255,255,0.055)',
          backdropFilter: 'blur(18px)',
          color: mutedTextColor,
          fontSize: layout === 'portrait' ? 13 : 12,
          fontWeight: 800,
          letterSpacing: layout === 'portrait' ? 2.5 : 2.2,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: accentColor,
            boxShadow: `0 0 ${12 + energy * 20}px ${accentColor}`,
          }}
        />
        NOW PLAYING
      </div>

      <div
        style={{
          marginTop: layout === 'portrait' ? 30 : 34,
          fontSize: titleSize,
          lineHeight: 0.91,
          fontWeight: 900,
          letterSpacing: layout === 'square' ? -3.5 : -5.8,
          textTransform: 'uppercase',
          textWrap: 'balance',
          textShadow: '0 22px 70px rgba(0,0,0,0.38)',
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: layout === 'portrait' ? 29 : 27,
          display: 'flex',
          alignItems: 'center',
          gap: layout === 'portrait' ? 20 : 18,
        }}
      >
        <div
          style={{
            width: layout === 'portrait' ? 78 : 64,
            height: 3,
            borderRadius: 99,
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
            boxShadow: `0 0 ${18 + energy * 12}px color-mix(in srgb, ${secondaryColor} 45%, transparent)`,
          }}
        />
        <div
          style={{
            color: textColor,
            fontSize: layout === 'portrait' ? 31 : layout === 'square' ? 23 : 29,
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: layout === 'portrait' ? 5.2 : 4.2,
            textTransform: 'uppercase',
          }}
        >
          {artist}
        </div>
      </div>

      <div
        style={{
          marginTop: layout === 'portrait' ? 28 : 24,
          color: mutedTextColor,
          fontSize: layout === 'portrait' ? 15 : 13,
          lineHeight: 1,
          fontWeight: 700,
          letterSpacing: layout === 'portrait' ? 3.4 : 2.8,
          textTransform: 'uppercase',
        }}
      >
        {website}
      </div>
    </div>
  );
};
