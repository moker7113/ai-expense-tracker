import { jwtVerify, SignJWT } from "jose";

// 只依賴 jose，proxy.ts 與 route handler 都能用
export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 天

export type SessionPayload = { userId: string; role: "user" | "admin" };

function secretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("缺少環境變數 JWT_SECRET");
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    if (typeof payload.userId !== "string") return null;
    return { userId: payload.userId, role: payload.role === "admin" ? "admin" : "user" };
  } catch {
    return null; // 過期或被竄改
  }
}

export const sessionCookieOptions = {
  httpOnly: true, // JS 讀不到，降低 XSS 竊取風險
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
