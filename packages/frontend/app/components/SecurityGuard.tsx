"use client";

import { useEffect } from "react";

export default function SecurityGuard() {
  useEffect(() => {
    // Block right-click
    const noContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", noContext);

    // Block common DevTools keyboard shortcuts
    const noKeys = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") { e.preventDefault(); return; }
      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (DevTools)
      if (e.ctrlKey && e.shiftKey && ["I","i","J","j","C","c"].includes(e.key)) { e.preventDefault(); return; }
      // Ctrl+U (View Source)
      if (e.ctrlKey && ["U","u"].includes(e.key)) { e.preventDefault(); return; }
      // Ctrl+S (Save page)
      if (e.ctrlKey && ["S","s"].includes(e.key)) { e.preventDefault(); return; }
    };
    document.addEventListener("keydown", noKeys);

    // Block text selection on sensitive areas
    document.body.style.webkitUserSelect = "none";

    return () => {
      document.removeEventListener("contextmenu", noContext);
      document.removeEventListener("keydown", noKeys);
      document.body.style.webkitUserSelect = "";
    };
  }, []);

  return null;
}
