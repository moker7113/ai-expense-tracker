"use client";

import { useState } from "react";
import { categoryIcon, categoryTint } from "@/lib/categories";
import { money, weekdayOf } from "@/lib/date";
import type { Item } from "./types";

type Props = {
  item: Item;
  onClose: () => void;
  onDeleted: (id: string) => void;
};

// 點記帳後從底部滑出的詳細資訊，可刪除
export default function ItemSheet({ item, onClose, onDeleted }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const date = item.date.slice(0, 10);

  async function remove() {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/expenses/${item._id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "刪除失敗");
      onDeleted(item._id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "刪除失敗");
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" role="dialog" aria-modal="true">
      <div className="animate-fade absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]" onClick={deleting ? undefined : onClose} />

      <div className="animate-sheet relative w-full max-w-md rounded-t-[28px] bg-card px-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] pt-3 shadow-lift">
        <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-line" />

        <div className="flex items-center gap-4">
          <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${categoryTint(item.category)}`}>
            {categoryIcon(item.category)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold">{item.description || item.category}</p>
            <p className="text-sm text-muted">
              {item.category} · {Number(date.slice(5, 7))} 月 {Number(date.slice(8))} 日 週{weekdayOf(date)}
            </p>
          </div>
        </div>

        <p className={`mt-5 text-4xl font-bold tabular-nums tracking-tight ${item.type === "income" ? "text-income" : ""}`}>
          {item.type === "income" ? "+" : "−"}
          {money(item.amount)}
          <span className="ml-1.5 text-base font-medium text-muted">{item.currency}</span>
        </p>

        {item.rawText && (
          <div className="mt-4 rounded-2xl bg-background p-3.5">
            <p className="text-xs font-semibold text-muted">原始輸入</p>
            <p className="mt-1 text-sm">「{item.rawText}」</p>
          </div>
        )}

        {error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-expense">{error}</p>}

        <div className="mt-6 space-y-2.5">
          {confirming ? (
            <>
              <p className="text-center text-sm font-medium text-muted">確定要刪除這筆記帳嗎？刪除後無法復原。</p>
              <button
                onClick={remove}
                disabled={deleting}
                className="w-full rounded-2xl bg-expense py-3.5 font-semibold text-white shadow-[0_8px_20px_rgb(229_72_77/0.3)] transition active:scale-[0.98] disabled:opacity-60"
              >
                {deleting ? "刪除中…" : "確定刪除"}
              </button>
              <button
                onClick={() => setConfirming(false)}
                disabled={deleting}
                className="w-full rounded-2xl bg-background py-3.5 font-semibold transition active:scale-[0.98]"
              >
                取消
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setConfirming(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 py-3.5 font-semibold text-expense transition active:scale-[0.98]"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
                </svg>
                刪除這筆
              </button>
              <button onClick={onClose} className="w-full rounded-2xl bg-background py-3.5 font-semibold transition active:scale-[0.98]">
                關閉
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
