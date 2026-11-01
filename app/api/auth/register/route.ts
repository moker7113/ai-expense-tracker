import bcrypt from "bcryptjs";
import { startSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { UserModel } from "@/models/User";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGISTER_CODE = "love"; // 註冊驗證碼（暫時寫死）

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const code = typeof body?.code === "string" ? body.code.trim() : "";

  // 驗證碼必須在伺服器檢查，前端檢查可以被繞過
  if (code !== REGISTER_CODE) return Response.json({ error: "驗證碼錯誤" }, { status: 403 });
  if (!EMAIL_RE.test(email)) return Response.json({ error: "Email 格式不正確" }, { status: 400 });
  if (password.length < 8) return Response.json({ error: "密碼至少 8 個字元" }, { status: 400 });
  if (password.length > 72) return Response.json({ error: "密碼最多 72 個字元" }, { status: 400 }); // bcrypt 上限
  if (!name || name.length > 50) return Response.json({ error: "請輸入名稱（50 字以內）" }, { status: 400 });

  try {
    await connectDB();
    if (await UserModel.exists({ email })) {
      return Response.json({ error: "這個 Email 已經註冊過了" }, { status: 409 });
    }

    // role 一律由伺服器決定，不接受前端傳入
    const user = await UserModel.create({
      email,
      name,
      password: await bcrypt.hash(password, 10),
      role: "user",
    });
    await startSession(user);

    return Response.json(
      { user: { id: String(user._id), email: user.email, name: user.name, role: user.role } },
      { status: 201 }
    );
  } catch (err) {
    // 兩個請求同時註冊同一 email 時，由 unique index 擋下
    if ((err as { code?: number }).code === 11000) {
      return Response.json({ error: "這個 Email 已經註冊過了" }, { status: 409 });
    }
    console.error("[api/auth/register]", err);
    return Response.json({ error: "註冊失敗，請稍後再試" }, { status: 500 });
  }
}
