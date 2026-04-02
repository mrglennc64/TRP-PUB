"use client";

import { useEffect, useState } from "react";

const SPLASH_KEY = "trp_splash_seen";

/*
  Sequence (all centered, no movement)
  ──────────────────────────────────────
  0.00 – 0.55s   shield fades in, opacity 0 → 1
  0.55 – 0.80s   lock-in: scale 1.00 → 0.982 → 1.00
  0.90 – 1.35s   wordmark fades in, opacity 0 → 1, no movement
  1.35 – 1.80s   hold
  1.80 – 2.35s   overlay fades out
  2.35s          removed from DOM
*/

export default function SplashAnimation() {
  const [phase, setPhase] = useState<"init" | "animate" | "exit" | "done">("init");
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_KEY)) {
      setPhase("done");
      return;
    }
    const t0 = setTimeout(() => setPhase("animate"), 30);
    const t1 = setTimeout(() => setTextVisible(true), 1700);
    const t2 = setTimeout(() => setPhase("exit"), 3200);
    const t3 = setTimeout(() => {
      sessionStorage.setItem(SPLASH_KEY, "1");
      setPhase("done");
    }, 3900);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === "done") return null;

  return (
    <>
      <style>{`
        @keyframes trpShieldReveal {
          0%   { opacity: 0;   transform: scale(1.000); }
          55%  { opacity: 1;   transform: scale(1.000); }
          68%  { opacity: 1;   transform: scale(0.982); }
          84%  { opacity: 1;   transform: scale(1.002); }
          100% { opacity: 1;   transform: scale(1.000); }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#080810",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: phase === "exit" ? 0 : 1,
          transition: phase === "exit" ? "opacity 0.52s ease-in" : "none",
          pointerEvents: phase === "exit" ? "none" : "all",
        }}
      >
        {/* Shield — fade in + lock-in, no position change */}
        {phase === "animate" && (
          <img
            src="/images/trp-shield.png"
            alt=""
            style={{
              height: 304,
              width: "auto",
              display: "block",
              animation: "trpShieldReveal 1.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
              filter: "grayscale(15%) brightness(1.04) contrast(1.06)",
            }}
          />
        )}

        {/* Wordmark — fade in only, centered, no movement */}
        <div
          style={{
            marginTop: 20,
            opacity: textVisible ? 1 : 0,
            transition: "opacity 0.85s ease-in",
          }}
        >
          <img
            src="/images/trp-wordmark.png"
            alt="TrapRoyalties PRO"
            style={{
              height: 88,
              width: "auto",
              display: "block",
              filter: "grayscale(10%) brightness(1.15)",
            }}
          />
        </div>
      </div>
    </>
  );
}
