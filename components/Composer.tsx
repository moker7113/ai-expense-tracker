"use client";

import { useState } from "react";
import type { Item } from "./types";

export default function Composer({ onAdded }: { onAdded: (items: Item[]) => void }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "發生錯誤");
      if (data.items.length === 0) throw new Error("沒有辨識到記帳內容，換個說法試試");
      setText("");
      onAdded(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit}>
      {error && (
        <p className="mb-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-expense">{error}</p>
      )}
      <div
        className={`flex items-center gap-2 rounded-2xl bg-card p-1.5 pl-3 shadow-lift ring-1 transition-shadow ${
          loading ? "ring-accent/40" : "ring-line focus-within:ring-2 focus-within:ring-accent/50"
        }`}
      >
        <span className="text-lg" aria-hidden>
          ✨
        </span>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={loading ? "AI 分析中…" : "午餐牛肉麵 150、搭計程車 280"}
          disabled={loading}
          className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-muted/70 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          aria-label="送出"
          className="bg-brand flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-glow transition-all active:scale-90 disabled:opacity-35 disabled:shadow-none"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}
