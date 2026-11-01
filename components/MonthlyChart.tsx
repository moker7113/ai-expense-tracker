"use client";

import { money } from "@/lib/date";
import type { Item } from "./types";

type Props = {
  year: string;
  items: Item[];
  selectedMonth: number | null; // 1-12
  onSelect: (m: number) => void;
  onOpenMonth: (month: string) => void; // YYYY-MM
};

// 全年每月支出：單一色相的直條圖，點一下長條看數字
export default function MonthlyChart({ year, items, selectedMonth, onSelect, onOpenMonth }: Props) {
  const totals = Array.from({ length: 12 }, () => 0);
  for (const i of items) {
    if (i.type === "expense") totals[Number(i.date.slice(5, 7)) - 1] += i.amount;
  }
  const max = Math.max(...totals);
  const active = selectedMonth;

  return (
    <section className="rounded-3xl bg-card p-5 shadow-soft">
      <div className="mb-5 flex items-center justify-between gap-2">
        <h2 className="font-bold">每月支出</h2>
        {active ? (
          <button
            onClick={() => onOpenMonth(`${year}-${String(active).padStart(2, "0")}`)}
            className="flex items-center gap-1.5 rounded-full bg-accent-soft py-1 pl-3 pr-2 text-xs font-medium text-accent active:scale-95"
          >
            {active} 月 <span className="font-bold tabular-nums">{money(totals[active - 1])}</span>
            <span className="text-sm">›</span>
          </button>
        ) : (
          <span className="text-xs text-muted">點長條看金額</span>
        )}
      </div>

      {max === 0 ? (
        <p className="py-8 text-center text-sm text-muted">今年還沒有支出紀錄</p>
      ) : (
        <>
          <div className="relative flex h-40 items-end gap-1.5 border-b border-line">
            {/* 背景格線 */}
            <div className="pointer-events-none absolute inset-x-0 top-0 border-t border-dashed border-line" />
            <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-dashed border-line" />
            {totals.map((v, idx) => {
              const m = idx + 1;
              const dim = active !== null && active !== m;
              return (
                // 點擊區是整欄高度，比長條本身大，方便手指點
                <button
                  key={m}
                  onClick={() => onSelect(m)}
                  aria-label={`${m} 月支出 ${money(v)}`}
                  className="relative flex h-full flex-1 items-end"
                >
                  <span
                    className={`w-full rounded-t-md bg-accent transition-[height,opacity] duration-500 ${
                      dim ? "opacity-25" : ""
                    }`}
                    style={{ height: v ? `max(${(v / max) * 100}%, 4px)` : 0 }}
                  />
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex gap-1.5">
            {totals.map((_, idx) => (
              <span
                key={idx}
                className={`flex-1 text-center text-[10px] tabular-nums ${
                  active === idx + 1 ? "font-bold text-accent" : "text-muted"
                }`}
              >
                {idx + 1}
              </span>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
