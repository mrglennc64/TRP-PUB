"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Page() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>TrapRoyalties Pro – Find Missing Royalties</title>

        <script src="https://cdn.tailwindcss.com"></script>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@600;700&display=swap"
          rel="stylesheet"
        />

        <style>{`
          body { font-family: 'Inter', sans-serif; background-color: #000; color: #e0e0e0; }
          h1, h2, h3 { font-family: 'Orbitron', sans-serif; }
          .neon-purple { text-shadow: 0 0 10px #a855f7, 0 0 20px #a855f7; }
          .neon-cyan { text-shadow: 0 0 10px #06b6d4, 0 0 20px #06b6d4; }
          .gradient-bg { background: linear-gradient(135deg, #1e0033, #000033, #000); }
        `}</style>
      </Head>

      <Header />

      <nav className="fixed w-full z-50 bg-black/70 backdrop-blur-md border-b border-purple-900/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-3">
            <div className="text-3xl font-bold neon-purple">TrapRoyalties Pro</div>
          </a>

          <div className="hidden md:flex items-center space-x-8">
            {/* Add nav links here if needed */}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16">
        {/* Your page content goes here */}
        <form onSubmit={handleSubmit}>
          {/* form fields here */}
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
