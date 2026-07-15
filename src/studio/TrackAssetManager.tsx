import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { ACTIVE_TRACK_TOKEN } from "../utils/audio-track";
import { AudioAssetDock } from "./AudioAssetDock";
import { Audio } from "@remotion/media";

export const TrackAssetManager: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 18% 22%, rgba(140,123,255,0.22), transparent 34%), radial-gradient(circle at 78% 72%, rgba(51,214,255,0.16), transparent 36%), #06070B",
        color: "#F7F8FF",
        fontFamily: "Inter, Avenir Next, Helvetica Neue, Arial, sans-serif",
        padding: 70,
      }}
    >
      <div style={{ maxWidth: 700 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 900,
            letterSpacing: 4,
            color: "#8C7BFF",
          }}
        >
          STUDIO TOOL
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 64,
            lineHeight: 0.96,
            fontWeight: 950,
          }}
        >
          Track Asset Manager
        </div>
        <div
          style={{
            marginTop: 28,
            maxWidth: 650,
            color: "#A7ADC2",
            fontSize: 22,
            lineHeight: 1.48,
          }}
        >
          Import a music file or select an existing asset. The active-track
          manifest is updated, and every music-video composition will derive its
          timeline length from that track.
        </div>
        <div
          style={{
            marginTop: 38,
            width: 520,
            padding: "22px 24px",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 18,
            background: "rgba(255,255,255,0.045)",
            color: "#C9CDDA",
            fontSize: 16,
            lineHeight: 1.55,
          }}
        >
          <strong style={{ color: "#F7F8FF" }}>Workflow:</strong> choose a track
          on the right, then open any Quick-Start or Template-Gallery
          composition. The audio appears as a named timeline layer beginning at
          frame 0.
        </div>
      </div>
      <AudioAssetDock
        activeAudioFile={ACTIVE_TRACK_TOKEN}
        backgroundColor="#06070B"
        accentColor="#33D6FF"
        textColor="#F7F8FF"
        mutedTextColor="#A7ADC2"
        initiallyOpen
        bindCurrentComposition={false}
      />
      <Audio src={staticFile("Quantum_Echoes_Caffeine Daydream_MASTER.mp3")} />
    </AbsoluteFill>
  );
};
