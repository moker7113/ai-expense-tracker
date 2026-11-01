import { categoryIcon, categoryTint } from "@/lib/categories";
import { money } from "@/lib/date";
import HeroCard from "./HeroCard";
import type { Item } from "./types";

type Props = {
  items: Item[];
  loading: boolean;
  label: string; // 例如「本月」「10 月」「本年」「2025 年」
  children?: React.ReactNode; // 插在總覽與分類之間（年度的每月圖表）
};

export default function StatsView({ items, loading, label, children }: Props) {
  const expenses = items.filter((i) => i.type === "expense");
  const totalExpense = expenses.reduce((s, i) => s + i.amount, 0);

  // 各分類支出，金額大到小排序
  const byCategory = Object.entries(
    expenses.reduce<Record<string, { amount: number; count: number }>>((acc, i) => {
      acc[i.category] ??= { amount: 0, count: 0 };
      acc[i.category].amount += i.amount;
      acc[i.category].count += 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1].amount - a[1].amount);
  const max = byCategory[0]?.[1].amount ?? 0;

  return (
    <div className="space-y-4">
      <HeroCard items={items} label={label} loading={loading} />

      {!loading && children}

      {/* 各分類支出：依金額排序的橫條（單一色相） */}
      <section className="rounded-3xl bg-card p-5 shadow-soft">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-bold">各項目花費</h2>
          {byCategory.length > 0 && <span className="text-xs text-muted">共 {byCategory.length} 類</span>}
        </div>
        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-xl bg-background" />
            ))}
          </div>
        ) : byCategory.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">{label}還沒有支出紀錄</p>
        ) : (
          <ul className="space-y-4">
            {byCategory.map(([category, { amount, count }]) => {
              const pct = totalExpense ? (amount / totalExpense) * 100 : 0;
              return (
                <li key={category} className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${categoryTint(category)}`}
                  >
                    {categoryIcon(category)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-baseline gap-2 text-sm">
                      <span className="font-semibold">{category}</span>
                      <span className="text-xs text-muted">{count} 筆</span>
                      <span className="ml-auto font-bold tabular-nums">{money(amount)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-background">
                        <div
                          className="h-full rounded-full bg-accent transition-[width] duration-500"
                          style={{ width: `${max ? (amount / max) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="w-9 text-right text-xs tabular-nums text-muted">{pct.toFixed(0)}%</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
