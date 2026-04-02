"use client";

import { useEffect, useState } from "react";

const SPLASH_KEY = "trp_splash_seen";

export default function SplashAnimation() {
  const [phase, setPhase] = useState<"idle" | "enter" | "hold" | "exit" | "done">("idle");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SPLASH_KEY)) {
      setPhase("done");
      return;
    }
    // Start entrance
    const t1 = setTimeout(() => setPhase("enter"), 60);
    // Hold center
    const t2 = setTimeout(() => setPhase("hold"), 1200);
    // Fade out
    const t3 = setTimeout(() => setPhase("exit"), 2000);
    // Remove
    const t4 = setTimeout(() => {
      sessionStorage.setItem(SPLASH_KEY, "1");
      setPhase("done");
    }, 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  if (phase === "done") return null;

  const shieldStyle: React.CSSProperties = {
    transform: phase === "enter" || phase === "hold"
      ? "translateX(0)"
      : phase === "exit"
      ? "translateX(-6px)"
      : "translateX(-55vw)",
    transition: phase === "enter"
      ? "transform 0.72s cubic-bezier(0.34, 1.56, 0.64, 1)"
      : phase === "exit"
      ? "transform 0.55s ease-in"
      : "none",
    opacity: phase === "exit" ? 0 : 1,
  };

  const wordmarkStyle: React.CSSProperties = {
    transform: phase === "enter" || phase === "hold"
      ? "translateX(0)"
      : phase === "exit"
      ? "translateX(6px)"
      : "translateX(55vw)",
    transition: phase === "enter"
      ? "transform 0.72s cubic-bezier(0.34, 1.56, 0.64, 1)"
      : phase === "exit"
      ? "transform 0.55s ease-in"
      : "none",
    opacity: phase === "exit" ? 0 : 1,
  };

  const overlayStyle: React.CSSProperties = {
    opacity: phase === "exit" ? 0 : 1,
    transition: phase === "exit" ? "opacity 0.6s ease-in" : "none",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#05060f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: phase === "exit" ? "none" : "all",
        ...overlayStyle,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0px" }}>
        {/* Shield — slides from left */}
        <img
          src="/images/trp-shield.png"
          alt=""
          style={{
            height: 160,
            width: "auto",
            display: "block",
            ...shieldStyle,
          }}
        />
        {/* Wordmark — slides from right */}
        <img
          src="/images/trp-wordmark.png"
          alt="TrapRoyalties PRO"
          style={{
            height: 100,
            width: "auto",
            display: "block",
            mixBlendMode: "screen",
            ...wordmarkStyle,
          }}
        />
      </div>
    </div>
  );
}
