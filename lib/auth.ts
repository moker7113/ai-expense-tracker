import { cookies } from "next/headers";
import { connectDB } from "./mongodb";
import { SESSION_COOKIE, sessionCookieOptions, signSession, verifySession } from "./session";
import { UserModel } from "@/models/User";

import type { PublicUser } from "@/components/types";

/** 讀取 cookie 取得目前登入的使用者；未登入或帳號已不存在回傳 null */
export async function getCurrentUser(): Promise<PublicUser | null> {
  const session = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return null;

  await connectDB();
  const user = await UserModel.findById(session.userId).lean();
  if (!user) return null;
  return { id: String(user._id), email: user.email, name: user.name, role: user.role };
}

/** 登入：寫入 session cookie（只能在 Route Handler / Server Function 中呼叫） */
export async function startSession(user: { _id: unknown; role: "user" | "admin" }) {
  const token = await signSession({ userId: String(user._id), role: user.role });
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions);
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export const unauthorized = () => Response.json({ error: "請先登入" }, { status: 401 });
