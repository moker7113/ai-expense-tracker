import { categoryIcon, categoryTint } from "@/lib/categories";
import { money, weekdayOf } from "@/lib/date";
import type { Item } from "./types";

export default function DayList({ items, loading, date }: { items: Item[]; loading: boolean; date: string }) {
  const expense = items.filter((i) => i.type === "expense").reduce((s, i) => s + i.amount, 0);
  const income = items.filter((i) => i.type === "income").reduce((s, i) => s + i.amount, 0);

  return (
    <section>
      <div className="mb-3 flex items-end justify-between px-1">
        <div>
          <h2 className="text-base font-bold">
            {Number(date.slice(5, 7))} 月 {Number(date.slice(8))} 日
            <span className="ml-1.5 text-sm font-medium text-muted">週{weekdayOf(date)}</span>
          </h2>
        </div>
        <div className="flex gap-3 text-xs text-muted tabular-nums">
          <span>
            支出 <b className="text-sm font-semibold text-foreground">{money(expense)}</b>
          </span>
          {income > 0 && (
            <span>
              收入 <b className="text-sm font-semibold text-income">{money(income)}</b>
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[68px] animate-pulse rounded-2xl bg-card shadow-soft" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl bg-card px-6 py-12 text-center shadow-soft">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-3xl">✨</div>
          <p className="font-semibold">這天還沒有記帳</p>
          <p className="mt-1 text-sm text-muted">在下方輸入一句話，AI 會幫你分類記好</p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {items.map((item) => (
            <li key={item._id} className="flex items-center gap-3 rounded-2xl bg-card p-3.5 shadow-soft">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${categoryTint(item.category)}`}
              >
                {categoryIcon(item.category)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{item.description || item.category}</p>
                <p className="mt-0.5 text-xs text-muted">{item.category}</p>
              </div>
              <span
                className={`shrink-0 text-[15px] font-bold tabular-nums ${
                  item.type === "income" ? "text-income" : "text-foreground"
                }`}
              >
                {item.type === "income" ? "+" : "−"}
                {money(item.amount)}
                {item.currency !== "TWD" && <span className="ml-1 text-xs font-medium text-muted">{item.currency}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
