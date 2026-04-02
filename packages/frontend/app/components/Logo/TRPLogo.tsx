"use client";

import { useEffect, useState } from "react";

interface TRPLogoProps {
  /** nav = compact single-line for navbar; hero = larger standalone use */
  variant?: "nav" | "hero";
  /** replay animation on every mount (default true) */
  animate?: boolean;
}

export default function TRPLogo({ variant = "nav", animate = true }: TRPLogoProps) {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (!animate) { setPlay(true); return; }
    // tiny delay so the nav is painted before animation fires
    const t = setTimeout(() => setPlay(true), 120);
    return () => clearTimeout(t);
  }, [animate]);

  const isNav = variant === "nav";

  // SVG dimensions
  const W = isNav ? 44 : 72;
  const H = isNav ? 44 : 72;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: isNav ? "10px" : "16px",
        userSelect: "none",
      }}
    >
      {/* ── Animated SVG Mark ── */}
      <svg
        width={W}
        height={H}
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, overflow: "visible" }}
      >
        {/* ── T ── */}
        {/* T crossbar */}
        <rect
          x="2" y="10" width="30" height="7" rx="2"
          fill="white"
          style={{
            opacity: play ? 1 : 0,
            transform: play ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "2px 13px",
            transition: play ? "opacity 0.28s ease 0.05s, transform 0.32s cubic-bezier(0.22,1,0.36,1) 0.05s" : "none",
          }}
        />
        {/* T stem */}
        <rect
          x="13" y="10" width="7" height="52" rx="2"
          fill="white"
          style={{
            opacity: play ? 1 : 0,
            transform: play ? "scaleY(1)" : "scaleY(0)",
            transformOrigin: "16px 10px",
            transition: play ? "opacity 0.3s ease 0.2s, transform 0.38s cubic-bezier(0.22,1,0.36,1) 0.2s" : "none",
          }}
        />

        {/* ── R ── */}
        {/* R stem */}
        <rect
          x="36" y="10" width="7" height="52" rx="2"
          fill="white"
          style={{
            opacity: play ? 1 : 0,
            transform: play ? "scaleY(1)" : "scaleY(0)",
            transformOrigin: "39px 10px",
            transition: play ? "opacity 0.3s ease 0.32s, transform 0.38s cubic-bezier(0.22,1,0.36,1) 0.32s" : "none",
          }}
        />
        {/* R bump */}
        <path
          d="M43 10 Q62 10 62 24 Q62 38 43 38 L43 10Z"
          fill="white"
          style={{
            opacity: play ? 1 : 0,
            transition: play ? "opacity 0.32s ease 0.44s" : "none",
          }}
        />
        {/* R leg */}
        <path
          d="M43 38 L62 62"
          stroke="white" strokeWidth="7" strokeLinecap="round"
          style={{
            strokeDasharray: 30,
            strokeDashoffset: play ? 0 : 30,
            transition: play ? "stroke-dashoffset 0.3s cubic-bezier(0.22,1,0.36,1) 0.58s" : "none",
          }}
        />

        {/* ── Cyan checkmark integrated into the R bump ── */}
        <polyline
          points="46,20 52,28 62,13"
          stroke="#38bdf8"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{
            strokeDasharray: 48,
            strokeDashoffset: play ? 0 : 48,
            transition: play ? "stroke-dashoffset 0.38s cubic-bezier(0.22,1,0.36,1) 0.78s" : "none",
          }}
        />
      </svg>

      {/* ── Wordmark ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          lineHeight: 1,
          opacity: play ? 1 : 0,
          transform: play ? "translateX(0)" : "translateX(-6px)",
          transition: play ? "opacity 0.4s ease 0.92s, transform 0.4s cubic-bezier(0.22,1,0.36,1) 0.92s" : "none",
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            fontSize: isNav ? "15px" : "26px",
            fontWeight: 800,
            letterSpacing: "-0.3px",
            color: "#e2e8f0",
          }}
        >
          TrapRoyalties<span style={{ color: "#818cf8" }}>PRO</span>
        </span>
        <span
          style={{
            fontFamily: "'Inter', 'Courier New', monospace",
            fontSize: isNav ? "8px" : "11px",
            fontWeight: 600,
            letterSpacing: "2.5px",
            color: "#475569",
            textTransform: "uppercase",
            marginTop: isNav ? "2px" : "4px",
            opacity: play ? 1 : 0,
            transition: play ? "opacity 0.4s ease 1.1s" : "none",
          }}
        >
          SMPT Verified System
        </span>
      </div>
    </div>
  );
}
