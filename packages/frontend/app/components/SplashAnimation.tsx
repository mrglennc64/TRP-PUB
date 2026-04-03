"use client";

import { useEffect, useState } from "react";

const SPLASH_KEY = "trp_splash_seen";

/*
  Sequence
  ─────────────────────────────────────────────
  0.00s        overlay mounts, shield opacity 0
  0.00–0.90s   shield fades in  (ease-out)
  0.90–1.10s   lock-in: scale 1.03 → 1.00  (ease-out)
  1.10–1.85s   "TrapRoyalties PRO" fades in  (ease-out)
  1.85–2.35s   hold
  2.35–2.85s   overlay fades out  (ease-in)
  2.85s        removed from DOM
*/

type Phase = "init" | "fadeShield" | "lockIn" | "fadeText" | "exit" | "done";

export default function SplashAnimation() {
  const [phase, setPhase] = useState<Phase>("init");

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_KEY)) { setPhase("done"); return; }

    const t0 = setTimeout(() => setPhase("fadeShield"), 40);
    const t1 = setTimeout(() => setPhase("lockIn"),     940);   // after 0.9s fade
    const t2 = setTimeout(() => setPhase("fadeText"),   1140);  // after 0.2s lock
    const t3 = setTimeout(() => setPhase("exit"),       2400);
    const t4 = setTimeout(() => {
      sessionStorage.setItem(SPLASH_KEY, "1");
      setPhase("done");
    }, 2950);

    return () => [t0,t1,t2,t3,t4].forEach(clearTimeout);
  }, []);

  if (phase === "done") return null;

  // Shield styles per phase
  const shieldOpacity = phase === "init" ? 0 : 1;
  const shieldScale   = phase === "lockIn" ? 1.03 : 1.00;

  const shieldTransition =
    phase === "fadeShield" ? "opacity 0.9s ease-out" :
    phase === "lockIn"     ? "transform 0.0s" :        // instant to 1.03
    phase === "fadeText"   ? "transform 0.2s ease-out" // settle back to 1.00
                           : "none";

  return (
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
        transition: phase === "exit" ? "opacity 0.5s ease-in" : "none",
        pointerEvents: phase === "exit" ? "none" : "all",
      }}
    >
      {/* Seal — centered, no position change ever */}
      <img
        src="/images/trp-shield.png"
        alt=""
        style={{
          height: 300,
          width: "auto",
          display: "block",
          opacity: shieldOpacity,
          transform: `scale(${shieldScale})`,
          transition: shieldTransition,
        }}
      />

      {/* Wordmark — fade in only, no movement */}
      <img
        src="/images/trp-wordmark.png"
        alt="TrapRoyalties PRO"
        style={{
          height: 80,
          width: "auto",
          display: "block",
          marginTop: 28,
          opacity: phase === "fadeText" || phase === "exit" ? 1 : 0,
          transition: phase === "fadeText" ? "opacity 0.75s ease-out" : "none",
          filter: "brightness(1.15)",
        }}
      />
    </div>
  );
}
