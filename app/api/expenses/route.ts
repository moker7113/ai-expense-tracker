import { getCurrentUser, unauthorized } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { ExpenseModel } from "@/models/Expense";

// GET /api/expenses?month=YYYY-MM → 該月所有記帳
// GET /api/expenses?year=YYYY     → 該年所有記帳
// （日期以 UTC 午夜存，代表當地日期）
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const params = new URL(request.url).searchParams;
  const month = params.get("month");
  const year = params.get("year");

  let start: Date;
  let end: Date;
  if (month && /^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    const [y, m] = month.split("-").map(Number);
    start = new Date(Date.UTC(y, m - 1, 1));
    end = new Date(Date.UTC(y, m, 1));
  } else if (year && /^\d{4}$/.test(year)) {
    const y = Number(year);
    start = new Date(Date.UTC(y, 0, 1));
    end = new Date(Date.UTC(y + 1, 0, 1));
  } else {
    return Response.json({ error: "需提供 month=YYYY-MM 或 year=YYYY" }, { status: 400 });
  }

  try {
    await connectDB();
    // 只查自己的記帳
    const items = await ExpenseModel.find({ user: user.id, date: { $gte: start, $lt: end } })
      .sort({ date: 1, createdAt: 1 })
      .lean();
    return Response.json({ items });
  } catch (err) {
    console.error("[api/expenses]", err);
    return Response.json({ error: "讀取失敗，請稍後再試" }, { status: 500 });
  }
}
