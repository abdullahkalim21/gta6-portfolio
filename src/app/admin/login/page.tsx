"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const password = new FormData(e.currentTarget).get("password");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.replace("/admin");
      router.refresh();
    } else {
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      setError(json.error ?? "Login failed.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form onSubmit={onSubmit} className="glass neon-border w-full max-w-sm rounded-2xl p-8">
        <p className="font-hud text-xs text-pink">RESTRICTED AREA</p>
        <h1 className="font-display mt-1 text-5xl">Control room</h1>
        <label htmlFor="password" className="label mt-6">
          Password
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" autoFocus />
        {error && (
          <p className="mt-3 text-sm text-pink" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} className="btn btn-primary mt-6 w-full">
          {loading ? "Checking…" : "Enter ▸"}
        </button>
      </form>
    </main>
  );
}
