"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PublicUser } from "./types";

export default function UserMenu({ user }: { user: PublicUser }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  async function logout() {
    setLeaving(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="帳號選單"
        className="bg-brand flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-glow ring-2 ring-white active:scale-95"
      >
        {user.name.slice(0, 1).toUpperCase()}
      </button>

      {open && (
        <>
          {/* 點外面關閉 */}
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="animate-toast absolute right-0 top-12 z-40 w-60 overflow-hidden rounded-2xl bg-card shadow-lift ring-1 ring-line">
            <div className="flex items-center gap-3 p-4">
              <span className="bg-brand flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate font-bold">{user.name}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
            </div>
            {user.role === "admin" && (
              <div className="px-4 pb-3">
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">管理員</span>
              </div>
            )}
            <button
              onClick={logout}
              disabled={leaving}
              className="flex w-full items-center gap-2 border-t border-line px-4 py-3 text-left text-sm font-medium text-expense active:bg-red-50 disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H3" />
              </svg>
              {leaving ? "登出中…" : "登出"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
