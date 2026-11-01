import { isValidObjectId } from "mongoose";
import { getCurrentUser, unauthorized } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { ExpenseModel } from "@/models/Expense";

// DELETE /api/expenses/:id → 刪除自己的一筆記帳
export async function DELETE(_req: Request, ctx: RouteContext<"/api/expenses/[id]">) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const { id } = await ctx.params;
  if (!isValidObjectId(id)) return Response.json({ error: "找不到這筆記帳" }, { status: 404 });

  try {
    await connectDB();
    // 條件同時帶 user：別人的記帳一律當作不存在，無法刪除
    const deleted = await ExpenseModel.findOneAndDelete({ _id: id, user: user.id });
    if (!deleted) return Response.json({ error: "找不到這筆記帳" }, { status: 404 });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[api/expenses/:id DELETE]", err);
    return Response.json({ error: "刪除失敗，請稍後再試" }, { status: 500 });
  }
}
