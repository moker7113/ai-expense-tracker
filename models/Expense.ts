import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const EXPENSE_CATEGORIES = [
  "餐飲",
  "交通",
  "購物",
  "娛樂",
  "居住",
  "醫療",
  "教育",
  "薪資",
  "投資",
  "其他",
] as const;

const expenseSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true }, // 記帳的人
    type: { type: String, enum: ["expense", "income"], required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "TWD" },
    category: { type: String, enum: EXPENSE_CATEGORIES, default: "其他" },
    description: { type: String, default: "" },
    date: { type: Date, required: true },
    rawText: { type: String, required: true }, // 使用者原始輸入，方便日後追溯
  },
  { timestamps: true }
);

export type Expense = InferSchemaType<typeof expenseSchema>;

// 避免 hot reload 時重複編譯 model
export const ExpenseModel: Model<Expense> =
  (mongoose.models.Expense as Model<Expense>) ?? mongoose.model<Expense>("Expense", expenseSchema);
