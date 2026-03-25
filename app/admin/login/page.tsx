"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        setError("Incorrect password.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="eyebrow mb-6 text-center">Agavi AI</div>
        <div className="panel-card p-8">
          <h1 className="font-heading font-bold text-surface text-xl mb-1">
            Admin Access
          </h1>
          <p className="text-muted text-sm mb-6">Enter your admin password to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-muted text-xs font-semibold uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 rounded-xl text-surface placeholder-muted text-sm outline-none transition-colors"
                style={{
                  background: "rgba(255,255,255,.04)",
                  border: error
                    ? "1px solid rgba(248,113,113,.5)"
                    : "1px solid rgba(255,255,255,.1)",
                }}
              />
              {error && (
                <p className="text-red-400 text-xs mt-2">{error}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full font-bold text-bg text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #5ef6ee, #57d6ff)",
              }}
            >
              {loading ? "Checking…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
