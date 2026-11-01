import { money } from "@/lib/date";
import type { Item } from "./types";

// 漸層總覽卡：支出（大數字）、收入、結餘
export default function HeroCard({ items, label, loading }: { items: Item[]; label: string; loading: boolean }) {
  const expense = items.filter((i) => i.type === "expense").reduce((s, i) => s + i.amount, 0);
  const income = items.filter((i) => i.type === "income").reduce((s, i) => s + i.amount, 0);

  return (
    <section className="bg-brand relative overflow-hidden rounded-3xl p-5 text-white shadow-glow">
      {/* 裝飾光圈 */}
      <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 left-10 h-32 w-32 rounded-full bg-fuchsia-300/25 blur-2xl" />

      <p className="relative text-sm text-white/75">{label}支出</p>
      <p className="relative mt-1 text-4xl font-bold tabular-nums tracking-tight">
        {loading ? <span className="inline-block h-10 w-36 animate-pulse rounded-lg bg-white/20 align-middle" /> : money(expense)}
      </p>
      <div className="relative mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-white/12 p-3 backdrop-blur-sm">
        <div>
          <p className="text-xs text-white/70">{label}收入</p>
          <p className="mt-0.5 font-semibold tabular-nums">{loading ? "—" : money(income)}</p>
        </div>
        <div>
          <p className="text-xs text-white/70">結餘</p>
          <p className="mt-0.5 font-semibold tabular-nums">{loading ? "—" : money(income - expense)}</p>
        </div>
      </div>
    </section>
  );
}
