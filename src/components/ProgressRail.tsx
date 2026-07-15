import React from 'react';
import {formatTime} from '../utils/format-time';

type ProgressRailProps = {
  frame: number;
  audioDurationInFrames: number;
  fps: number;
  showTimecode: boolean;
  textColor: string;
  mutedTextColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  compact: boolean;
};

export const ProgressRail: React.FC<ProgressRailProps> = ({
  frame,
  audioDurationInFrames,
  fps,
  showTimecode,
  textColor,
  mutedTextColor,
  primaryColor,
  secondaryColor,
  accentColor,
  compact,
}) => {
  const lastAudioFrame = Math.max(1, audioDurationInFrames - 1);
  const progress = Math.max(0, Math.min(1, frame / lastAudioFrame));
  const currentSeconds = Math.min(frame, lastAudioFrame) / fps;
  const durationSeconds = audioDurationInFrames / fps;

  return (
    <div style={{width: '100%'}}>
      {showTimecode ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: compact ? 11 : 14,
            color: mutedTextColor,
            fontSize: compact ? 10 : 12,
            fontWeight: 800,
            letterSpacing: compact ? 1.7 : 2.2,
          }}
        >
          <span style={{color: textColor}}>{formatTime(currentSeconds)}</span>
          <span>{formatTime(durationSeconds)}</span>
        </div>
      ) : null}

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: compact ? 4 : 5,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.12)',
          overflow: 'visible',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            borderRadius: 999,
            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor} 58%, ${accentColor})`,
            boxShadow: `0 0 18px color-mix(in srgb, ${secondaryColor} 45%, transparent)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `${progress * 100}%`,
            top: '50%',
            width: compact ? 10 : 13,
            height: compact ? 10 : 13,
            borderRadius: '50%',
            backgroundColor: textColor,
            boxShadow: `0 0 20px color-mix(in srgb, ${accentColor} 78%, transparent)`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </div>
  );
};
