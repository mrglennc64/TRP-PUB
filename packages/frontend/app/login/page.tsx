"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={styles.body} />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2 style={styles.h2}>TrapRoyaltiesPro Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <div style={styles.error}>{error}</div>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  body: {
    background: "#0b0b0b",
    color: "#e5e5e5",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    margin: 0,
  },
  container: {
    width: 360,
    padding: 32,
    background: "#141414",
    borderRadius: 12,
    boxShadow: "0 0 20px rgba(0,0,0,0.4)",
  },
  h2: {
    marginTop: 0,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 14,
    borderRadius: 6,
    border: "1px solid #333",
    background: "#1c1c1c",
    color: "#fff",
    fontSize: 15,
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: 12,
    background: "#00c46c",
    border: "none",
    borderRadius: 6,
    fontSize: 16,
    fontWeight: "bold",
    cursor: "pointer",
    color: "#000",
  },
  error: {
    marginTop: 12,
    color: "#ff4d4d",
    textAlign: "center",
    fontSize: 14,
    minHeight: 20,
  },
};
