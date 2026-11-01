import { redirect } from "next/navigation";
import { Suspense } from "react";
import ExpenseApp from "@/components/ExpenseApp";
import { getCurrentUser } from "@/lib/auth";

export default function Page() {
  // 讀 cookie 屬於請求時才知道的資料，需放在 Suspense 內，外殼可先送出
  return (
    <Suspense fallback={<div className="min-h-dvh bg-background" />}>
      <AuthedApp />
    </Suspense>
  );
}

async function AuthedApp() {
  // proxy 已擋未登入，這裡再確認一次（例如帳號已被刪除）
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <ExpenseApp user={user} />;
}
