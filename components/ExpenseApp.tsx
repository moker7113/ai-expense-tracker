"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Composer from "@/components/Composer";
import DateStrip from "@/components/DateStrip";
import DayList from "@/components/DayList";
import HeroCard from "@/components/HeroCard";
import MonthlyChart from "@/components/MonthlyChart";
import StatsView from "@/components/StatsView";
import type { Item } from "@/components/types";
import UserMenu from "@/components/UserMenu";
import type { PublicUser } from "@/components/types";
import { formatMonth, monthOf, shiftMonth, todayKey } from "@/lib/date";

type Tab = "list" | "stats";
type Range = "month" | "year";

const noopSubscribe = () => () => {};

// 「今天」取決於使用者的裝置時間，只在瀏覽器端決定（伺服器預先渲染時顯示空殼）
export default function ExpenseApp({ user }: { user: PublicUser }) {
  const today = useSyncExternalStore(noopSubscribe, todayKey, () => null);
  if (!today) return <div className="min-h-dvh bg-background" />;
  return <Home today={today} user={user} />;
}

function Home({ today, user }: { today: string; user: PublicUser }) {
  const [tab, setTab] = useState<Tab>("list");
  const [selected, setSelected] = useState(today);
  const [month, setMonth] = useState(() => monthOf(today));
  const [range, setRange] = useState<Range>("month"); // 統計頁：月 / 年
  const [year, setYear] = useState(() => today.slice(0, 4));
  const [chartMonth, setChartMonth] = useState<number | null>(null); // 年度圖表點選的月份
  const [version, setVersion] = useState(0); // 新增記帳後 +1，觸發重新載入
  const [toast, setToast] = useState("");

  const monthData = useExpenses(`month=${month}`, version);
  const yearData = useExpenses(tab === "stats" && range === "year" ? `year=${year}` : null, version);

  const markedDays = useMemo(() => new Set(monthData.items.map((i) => i.date.slice(0, 10))), [monthData.items]);
  const dayItems = useMemo(
    () => monthData.items.filter((i) => i.date.startsWith(selected)),
    [monthData.items, selected]
  );

  const showYear = tab === "stats" && range === "year";

  function goToMonth(next: string) {
    setMonth(next);
    setYear(next.slice(0, 4));
    // 切到當月就選今天，否則選 1 號
    setSelected(next === monthOf(today) ? today : `${next}-01`);
  }

  function shift(delta: number) {
    if (showYear) {
      setYear(String(Number(year) + delta));
      setChartMonth(null);
    } else {
      goToMonth(shiftMonth(month, delta));
    }
  }

  function handleAdded(added: Item[]) {
    // 跳到新增項目的日期，並重新載入
    const target = added[0].date.slice(0, 10);
    setSelected(target);
    setMonth(monthOf(target));
    setYear(target.slice(0, 4));
    setVersion((v) => v + 1);
    setToast(`已新增 ${added.length} 筆`);
    setTimeout(() => setToast(""), 2000);
  }

  const isThisMonth = month === monthOf(today);
  const isThisYear = year === today.slice(0, 4);
  const monthLabel = isThisMonth ? "本月" : `${Number(month.slice(5))} 月`;
  const yearLabel = isThisYear ? "本年" : `${year} 年`;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
      {/* 頂部：問候 + 月份 / 年份切換 */}
      <header className="sticky top-0 z-10 bg-background/75 px-4 pb-2 pt-[max(env(safe-area-inset-top),1.25rem)] backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted">嗨，{user.name} 👋</p>
            <div className="mt-0.5 flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{showYear ? `${year} 年` : formatMonth(month)}</h1>
              <div className="flex gap-1">
                <RoundButton onClick={() => shift(-1)} label={showYear ? "上一年" : "上個月"}>
                  <Chevron dir="left" />
                </RoundButton>
                <RoundButton onClick={() => shift(1)} label={showYear ? "下一年" : "下個月"}>
                  <Chevron dir="right" />
                </RoundButton>
              </div>
            </div>
          </div>
          <UserMenu user={user} />
        </div>
        {tab === "list" ? (
          <DateStrip month={month} selected={selected} markedDays={markedDays} onSelect={setSelected} />
        ) : (
          <div className="pb-2">
            <Segmented
              value={range}
              onChange={setRange}
              options={[
                { value: "month", label: "月統計" },
                { value: "year", label: "年統計" },
              ]}
            />
          </div>
        )}
      </header>

      <main className="flex-1 px-4 pb-48 pt-2">
        {tab === "list" ? (
          <div className="space-y-5">
            <HeroCard items={monthData.items} label={monthLabel} loading={monthData.loading} />
            <DayList items={dayItems} loading={monthData.loading} date={selected} />
          </div>
        ) : showYear ? (
          <StatsView items={yearData.items} loading={yearData.loading} label={yearLabel}>
            <MonthlyChart
              year={year}
              items={yearData.items}
              selectedMonth={chartMonth}
              onSelect={(m) => setChartMonth(m === chartMonth ? null : m)}
              onOpenMonth={(m) => {
                goToMonth(m);
                setRange("month");
              }}
            />
          </StatsView>
        ) : (
          <StatsView items={monthData.items} loading={monthData.loading} label={monthLabel} />
        )}
      </main>

      {toast && (
        <div className="animate-toast fixed inset-x-0 top-[max(env(safe-area-inset-top),1rem)] z-30 mx-auto flex w-fit items-center gap-2 rounded-full bg-card py-2 pl-2 pr-4 text-sm font-semibold shadow-lift ring-1 ring-line">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-income text-white">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
              <path d="M5 12l5 5 9-10" />
            </svg>
          </span>
          {toast}
        </div>
      )}

      {/* 底部：浮動輸入框 + 分頁列 */}
      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-md bg-gradient-to-t from-background via-background/95 to-background/0 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-6">
        <Composer onAdded={handleAdded} />
        <nav className="mt-3 flex rounded-2xl bg-card p-1.5 shadow-soft ring-1 ring-line">
          <TabButton active={tab === "list"} onClick={() => setTab("list")} label="明細">
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </TabButton>
          <TabButton active={tab === "stats"} onClick={() => setTab("stats")} label="統計">
            <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
          </TabButton>
        </nav>
      </div>
    </div>
  );
}

// 依 query 抓記帳資料；query 為 null 時不抓
function useExpenses(query: string | null, version: number) {
  const router = useRouter();
  const [state, setState] = useState<{ key: string | null; items: Item[] }>({ key: null, items: [] });
  const key = query && `${query}#${version}`;

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    fetch(`/api/expenses?${query}`)
      .then((res) => {
        if (res.status === 401) router.replace("/login"); // 登入過期
        return res.ok ? res.json() : { items: [] };
      })
      .catch(() => ({ items: [] }))
      .then((data) => {
        if (!cancelled) setState({ key: `${query}#${version}`, items: data.items });
      });
    return () => {
      cancelled = true;
    };
  }, [query, version, router]);

  // 資料還是舊 query 的 → 視為載入中
  return { items: state.key === key ? state.items : [], loading: state.key !== key };
}

function Segmented<T extends string>(props: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex rounded-2xl bg-card p-1 shadow-soft ring-1 ring-line">
      {props.options.map((o) => (
        <button
          key={o.value}
          onClick={() => props.onChange(o.value)}
          className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all duration-200 ${
            props.value === o.value ? "bg-brand text-white shadow-glow" : "text-muted"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function TabButton(props: { active: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      onClick={props.onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 ${
        props.active ? "bg-accent-soft text-accent" : "text-muted"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
        {props.children}
      </svg>
      {props.label}
    </button>
  );
}

function RoundButton(props: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      onClick={props.onClick}
      aria-label={props.label}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-card text-foreground shadow-soft ring-1 ring-line transition active:scale-90"
    >
      {props.children}
    </button>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
      <path d={dir === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
    </svg>
  );
}
