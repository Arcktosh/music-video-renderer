import React from 'react';

type AudioSpectrumProps = {
  values: number[];
  intensity: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  maxHeight: number;
  opacity: number;
};

export const AudioSpectrum: React.FC<AudioSpectrumProps> = ({
  values,
  intensity,
  primaryColor,
  secondaryColor,
  accentColor,
  maxHeight,
  opacity,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: maxHeight,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: values.length >= 128 ? 3 : values.length >= 64 ? 5 : 8,
        opacity,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${secondaryColor}, ${accentColor}, transparent)`,
          opacity: 0.55,
        }}
      />

      {values.map((value, index) => {
        const position = values.length <= 1 ? 0 : index / (values.length - 1);
        const edgeWeight = 0.72 + Math.sin(position * Math.PI) * 0.28;
        const frequencyBoost = 0.86 + position * 0.38;
        const normalized = Math.min(1, Math.pow(value * 7.2 * intensity * frequencyBoost, 0.68));
        const height = 4 + normalized * maxHeight * edgeWeight;
        const color =
          position < 0.36 ? primaryColor : position < 0.72 ? secondaryColor : accentColor;

        return (
          <div
            key={`${index}-${values.length}`}
            style={{
              flex: 1,
              maxWidth: values.length >= 128 ? 8 : values.length >= 64 ? 14 : 24,
              minWidth: 2,
              height,
              borderRadius: '999px 999px 2px 2px',
              background: `linear-gradient(to top, color-mix(in srgb, ${color} 28%, transparent), ${color})`,
              boxShadow: `0 0 ${10 + normalized * 20}px color-mix(in srgb, ${color} 52%, transparent)`,
            }}
          />
        );
      })}
    </div>
  );
};
