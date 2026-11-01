import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

const AUTH_PAGES = ["/login", "/register"];

// 頁面層的導向：未登入 → /login；已登入還去登入頁 → 首頁
// （API 各自在 route handler 裡檢查，這裡只處理頁面）
export async function proxy(request: NextRequest) {
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  const { pathname } = request.nextUrl;
  const isAuthPage = AUTH_PAGES.includes(pathname);

  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register"],
};
