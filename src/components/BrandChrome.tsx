import React from "react";
import { Img } from "remotion";

type BrandChromeProps = {
  logoSrc: string;
  brandName: string;
  eyebrow: string;
  catalogLabel: string;
  copyrightLine: string;
  textColor: string;
  mutedTextColor: string;
  primaryColor: string;
  safeX: number;
  safeY: number;
  compact: boolean;
  opacity: number;
};

const initials = (value: string) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export const BrandChrome: React.FC<BrandChromeProps> = ({
  logoSrc,
  brandName,
  eyebrow,
  catalogLabel,
  copyrightLine,
  textColor,
  mutedTextColor,
  primaryColor,
  safeX,
  safeY,
  compact,
  opacity,
}) => {
  const logoSize = compact ? 46 : 56;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: safeX,
          top: safeY,
          display: "flex",
          alignItems: "center",
          gap: compact ? 13 : 16,
          opacity,
        }}
      >
        <div
          style={{
            width: logoSize,
            height: logoSize,
            borderRadius: compact ? 13 : 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            background: `linear-gradient(145deg, color-mix(in srgb, ${primaryColor} 28%, transparent), rgba(255,255,255,0.06))`,
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: `0 14px 42px color-mix(in srgb, ${primaryColor} 24%, transparent)`,
          }}
        >
          {logoSrc ? (
            <Img
              src={logoSrc}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <span
              style={{
                fontSize: compact ? 17 : 20,
                color: textColor,
                fontWeight: 900,
              }}
            >
              {initials(brandName)}
            </span>
          )}
        </div>

        <div>
          <div
            style={{
              color: textColor,
              fontSize: compact ? 17 : 21,
              fontWeight: 900,
              letterSpacing: compact ? 3.6 : 4.8,
              lineHeight: 1,
            }}
          >
            {brandName}
          </div>
          <div
            style={{
              marginTop: 8,
              color: mutedTextColor,
              fontSize: compact ? 9 : 11,
              fontWeight: 700,
              letterSpacing: compact ? 1.8 : 2.4,
            }}
          >
            {eyebrow}
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: safeX,
          top: safeY + (compact ? 10 : 12),
          color: mutedTextColor,
          fontSize: compact ? 9 : 11,
          fontWeight: 700,
          letterSpacing: compact ? 1.4 : 2.1,
          textAlign: "right",
          lineHeight: 1.5,
          opacity,
        }}
      >
        <div>{catalogLabel}</div>
        <div style={{ marginTop: 4, opacity: 0.62 }}>AUDIO-REACTIVE MASTER</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: safeX,
          bottom: Math.max(26, safeY * 0.54),
          color: mutedTextColor,
          fontSize: compact ? 8 : 9,
          fontWeight: 700,
          letterSpacing: compact ? 1.2 : 1.7,
          opacity: opacity * 0.68,
        }}
      >
        {copyrightLine}
      </div>
    </>
  );
};
