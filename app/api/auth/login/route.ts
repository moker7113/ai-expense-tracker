import bcrypt from "bcryptjs";
import { startSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) return Response.json({ error: "請輸入 Email 與密碼" }, { status: 400 });

  try {
    await connectDB();
    const user = await UserModel.findOne({ email }).select("+password");

    // 帳號不存在或密碼錯誤都回同樣訊息，避免被拿來探測哪些 email 有註冊
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return Response.json({ error: "Email 或密碼錯誤" }, { status: 401 });
    }

    await startSession(user);
    return Response.json({ user: { id: String(user._id), email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error("[api/auth/login]", err);
    return Response.json({ error: "登入失敗，請稍後再試" }, { status: 500 });
  }
}
