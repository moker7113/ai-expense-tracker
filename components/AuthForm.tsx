"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Mode = "login" | "register";

const APP_NAME = "家榮的AI家庭記帳本";

const FEATURES = [
  { icon: "💬", title: "一句話記帳", desc: "像傳訊息一樣輸入，不用一格一格填表" },
  { icon: "🤖", title: "AI 自動分類", desc: "自動辨識金額、日期與分類，還能一次拆多筆" },
  { icon: "📊", title: "月／年統計", desc: "各項花費排行、每月支出趨勢一目了然" },
  { icon: "📱", title: "手機優先", desc: "像 App 一樣順手，隨時隨地快速記一筆" },
];

export default function AuthForm({ mode }: { mode: Mode }) {
  const isRegister = mode === "register";

  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      {/* 背景光暈 */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-fuchsia-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />

      {/* 導覽列 */}
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-5 pb-2 pt-[max(env(safe-area-inset-top),1.25rem)]">
        <div className="flex items-center gap-2.5">
          <span className="bg-brand flex h-9 w-9 items-center justify-center rounded-xl text-lg shadow-glow">💸</span>
          <span className="font-bold tracking-tight">{APP_NAME}</span>
        </div>
        <Link
          href={isRegister ? "/login" : "/register"}
          className="rounded-full bg-card/80 px-4 py-2 text-sm font-semibold text-accent shadow-soft ring-1 ring-line backdrop-blur"
        >
          {isRegister ? "登入" : "註冊"}
        </Link>
      </nav>

      <main className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-8 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-16 lg:pt-16">
        {/* 左：主視覺 */}
        <section>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-card/80 px-3 py-1.5 text-xs font-semibold text-accent shadow-soft ring-1 ring-line backdrop-blur">
            ✨ AI 驅動的家庭記帳
          </span>
          <h1 className="mt-5 text-[40px] font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
            一句話，
            <br />
            <span className="bg-brand bg-clip-text text-transparent">記好全家每一筆帳</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            「午餐牛肉麵 150，晚上搭計程車 280」——說出來就好，AI 幫你拆成兩筆、分好類、記到正確的日期。
          </p>

          <a
            href="#auth"
            className="bg-brand mt-7 inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 font-semibold text-white shadow-glow transition active:scale-[0.98] lg:hidden"
          >
            {isRegister ? "立即註冊" : "開始記帳"}
            <span aria-hidden>↓</span>
          </a>

          <DemoCard />

          {/* 特色（桌機版顯示在左欄） */}
          <div className="mt-10 hidden grid-cols-2 gap-3 lg:grid">
            {FEATURES.map((f) => (
              <Feature key={f.title} {...f} />
            ))}
          </div>
        </section>

        {/* 右：登入 / 註冊表單 */}
        <section id="auth" className="scroll-mt-6 lg:sticky lg:top-10">
          <FormCard mode={mode} />
        </section>

        {/* 特色（手機版放在表單下方） */}
        <section className="grid grid-cols-2 gap-3 lg:hidden">
          {FEATURES.map((f) => (
            <Feature key={f.title} {...f} />
          ))}
        </section>
      </main>

      <footer className="relative pb-[max(env(safe-area-inset-bottom),1.5rem)] text-center text-xs text-muted">
        © {APP_NAME}
      </footer>
    </div>
  );
}

// 示意：輸入一句話 → AI 拆成兩筆
function DemoCard() {
  return (
    <div className="mt-10 max-w-md rounded-3xl bg-card/90 p-4 shadow-lift ring-1 ring-line backdrop-blur">
      <div className="flex justify-end">
        <p className="bg-brand max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm text-white shadow-glow">
          午餐牛肉麵 150，晚上搭計程車 280
        </p>
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-muted">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-[11px]">🤖</span>
        AI 已幫你記下 2 筆
      </p>
      <ul className="mt-2 space-y-2">
        {[
          { icon: "🍜", tint: "bg-orange-50", name: "午餐 牛肉麵", cat: "餐飲", amount: 150 },
          { icon: "🚕", tint: "bg-sky-50", name: "晚上 搭計程車", cat: "交通", amount: 280 },
        ].map((r) => (
          <li key={r.name} className="flex items-center gap-3 rounded-2xl bg-background p-3">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${r.tint}`}>{r.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold">{r.name}</p>
              <p className="text-xs text-muted">{r.cat} · 今天</p>
            </div>
            <span className="font-bold tabular-nums">−{r.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-card/80 p-4 shadow-soft ring-1 ring-line backdrop-blur">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-xl">{icon}</span>
      <p className="mt-3 font-bold">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{desc}</p>
    </div>
  );
}

function FormCard({ mode }: { mode: Mode }) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "", code: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isRegister ? form : { email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "發生錯誤");
      router.replace("/");
      router.refresh(); // 讓伺服器用新的 cookie 重新渲染
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生錯誤");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl bg-background px-4 py-3 text-base outline-none ring-1 ring-transparent transition placeholder:text-muted/60 focus:bg-card focus:ring-2 focus:ring-accent/50";

  return (
    <div className="rounded-3xl bg-card p-6 shadow-lift ring-1 ring-line sm:p-8">
      <h2 className="text-2xl font-bold tracking-tight">{isRegister ? "建立帳號" : "歡迎回來"}</h2>
      <p className="mt-1 text-sm text-muted">{isRegister ? "幾秒鐘就能開始記第一筆帳" : "登入後繼續記錄每一筆"}</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        {isRegister && (
          <Field label="名稱">
            <input value={form.name} onChange={set("name")} required maxLength={50} autoComplete="name" placeholder="你的暱稱" className={inputClass} />
          </Field>
        )}
        <Field label="Email">
          <input type="email" value={form.email} onChange={set("email")} required autoComplete="email" placeholder="you@example.com" className={inputClass} />
        </Field>
        <Field label="密碼">
          <input
            type="password"
            value={form.password}
            onChange={set("password")}
            required
            minLength={isRegister ? 8 : undefined}
            maxLength={72}
            autoComplete={isRegister ? "new-password" : "current-password"}
            placeholder={isRegister ? "至少 8 個字元" : "輸入密碼"}
            className={inputClass}
          />
        </Field>
        {isRegister && (
          <Field label="驗證碼">
            <input
              value={form.code}
              onChange={set("code")}
              required
              autoComplete="off"
              autoCapitalize="none"
              placeholder="請輸入註冊驗證碼"
              className={inputClass}
            />
          </Field>
        )}

        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-expense">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-brand w-full rounded-xl py-3.5 font-semibold text-white shadow-glow transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? "處理中…" : isRegister ? "註冊並開始記帳" : "登入"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {isRegister ? "已經有帳號？" : "還沒有帳號？"}
        <Link href={isRegister ? "/login" : "/register"} className="ml-1 font-semibold text-accent">
          {isRegister ? "登入" : "立即註冊"}
        </Link>
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted">{label}</span>
      {children}
    </label>
  );
}
