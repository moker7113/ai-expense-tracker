import OpenAI from "openai";
import { EXPENSE_CATEGORIES } from "@/models/Expense";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

export type AnalyzedItem = {
  type: "expense" | "income";
  amount: number;
  currency: string;
  category: (typeof EXPENSE_CATEGORIES)[number];
  description: string;
  date: string; // YYYY-MM-DD
};

// Structured Outputs：強制模型依照此 JSON schema 回傳
const schema = {
  type: "object",
  additionalProperties: false,
  required: ["items"],
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["type", "amount", "currency", "category", "description", "date"],
        properties: {
          type: { type: "string", enum: ["expense", "income"] },
          amount: { type: "number", description: "金額，正數" },
          currency: { type: "string", description: "ISO 4217 幣別，未提及時用 TWD" },
          category: { type: "string", enum: [...EXPENSE_CATEGORIES] },
          description: { type: "string", description: "簡短說明，例如「午餐 牛肉麵」" },
          date: { type: "string", description: "YYYY-MM-DD" },
        },
      },
    },
  },
} as const;

export async function analyzeText(text: string): Promise<AnalyzedItem[]> {
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Taipei" }); // YYYY-MM-DD

  const response = await openai.responses.create({
    model: MODEL,
    instructions: [
      "你是記帳助理。從使用者輸入的文字中擷取所有收入與支出項目。",
      `今天日期是 ${today}（台北時間），請把「今天、昨天、上週五」等相對日期換算成 YYYY-MM-DD。`,
      "一段文字可能包含多筆項目，請逐筆列出；若沒有任何記帳資訊，回傳空陣列。",
      "金額一律為正數，用 type 區分 expense / income。",
    ].join("\n"),
    input: text,
    text: {
      format: { type: "json_schema", name: "expense_items", strict: true, schema },
    },
  });

  const parsed = JSON.parse(response.output_text) as { items: AnalyzedItem[] };
  return parsed.items;
}
