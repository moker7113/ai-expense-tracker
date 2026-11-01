import { analyzeText } from "@/lib/analyze";
import { getCurrentUser, unauthorized } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { ExpenseModel } from "@/models/Expense";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  let text: unknown;
  try {
    ({ text } = await request.json());
  } catch {
    return Response.json({ error: "請求格式錯誤，需為 JSON" }, { status: 400 });
  }

  if (typeof text !== "string" || !text.trim()) {
    return Response.json({ error: "請輸入要分析的文字" }, { status: 400 });
  }
  if (text.length > 2000) {
    return Response.json({ error: "文字過長（上限 2000 字）" }, { status: 400 });
  }

  try {
    const items = await analyzeText(text.trim());

    await connectDB();
    const saved = await ExpenseModel.insertMany(
      items.map((item) => ({ ...item, user: user.id, date: new Date(item.date), rawText: text.trim() }))
    );

    return Response.json({ items: saved });
  } catch (err) {
    console.error("[api/analyze]", err);
    return Response.json({ error: "分析或儲存失敗，請稍後再試" }, { status: 500 });
  }
}
