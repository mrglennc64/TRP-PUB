"use client";

import React from "react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="w-full py-6 bg-black/70 backdrop-blur-md border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold neon-purple">
          {title || "TrapRoyalties Pro"}
        </h1>

        {subtitle && (
          <p className="text-purple-300 mt-1 text-sm">{subtitle}</p>
        )}
      </div>
    </header>
  );
}
