"use client";

import { useEffect, useState } from "react";

const SPLASH_KEY = "trp_splash_seen";

/*
  Sequence
  --------
  0.00s  shield begins off-screen top-left, opacity 0
  0.00–0.90s  arc motion (convex curve) to center, opacity 0 → 1
  0.90–1.05s  lock-in: scale 1.00 → 0.982 → 1.00
  1.10–1.55s  wordmark fades in, no movement
  1.55s  stable hold
  2.10s  overlay fades out
  2.70s  removed from DOM, sessionStorage flag set
*/

export default function SplashAnimation() {
  const [phase, setPhase] = useState<"init" | "animate" | "exit" | "done">("init");
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_KEY)) {
      setPhase("done");
      return;
    }
    const t0 = setTimeout(() => setPhase("animate"), 40);
    const t1 = setTimeout(() => setTextVisible(true), 1100);
    const t2 = setTimeout(() => setPhase("exit"), 2100);
    const t3 = setTimeout(() => {
      sessionStorage.setItem(SPLASH_KEY, "1");
      setPhase("done");
    }, 2700);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === "done") return null;

  return (
    <>
      <style>{`
        @keyframes trpShieldArc {
          0% {
            transform: translate(-52vw, -38vh) scale(0.88);
            opacity: 0;
          }
          14% {
            opacity: 0.55;
          }
          56% {
            transform: translate(-13vw, 5vh) scale(1.00);
            opacity: 1;
          }
          80% {
            transform: translate(0, 0) scale(1.00);
            opacity: 1;
          }
          89% {
            transform: translate(0, 0) scale(0.982);
            opacity: 1;
          }
          97% {
            transform: translate(0, 0) scale(1.001);
            opacity: 1;
          }
          100% {
            transform: translate(0, 0) scale(1.00);
            opacity: 1;
          }
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
          transition: phase === "exit" ? "opacity 0.55s cubic-bezier(0.4, 0, 1, 1)" : "none",
          pointerEvents: phase === "exit" ? "none" : "all",
        }}
      >
        {/* Shield — arc motion from top-left */}
        {phase === "animate" && (
          <img
            src="/images/trp-shield.png"
            alt=""
            style={{
              height: 148,
              width: "auto",
              display: "block",
              animation: "trpShieldArc 1.0s cubic-bezier(0.42, 0, 0.30, 1.0) forwards",
              filter: "grayscale(18%) brightness(1.05) contrast(1.08)",
            }}
          />
        )}

        {/* Wordmark — opacity fade only, no movement */}
        <img
          src="/images/trp-wordmark.png"
          alt="TrapRoyalties PRO"
          style={{
            height: 46,
            width: "auto",
            display: "block",
            marginTop: 22,
            opacity: textVisible ? 1 : 0,
            transition: textVisible ? "opacity 0.42s ease-in" : "none",
            filter: "grayscale(10%) brightness(1.15)",
          }}
        />
      </div>
    </>
  );
}
