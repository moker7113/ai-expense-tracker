// 每個分類的圖示與柔和底色（底色只是裝飾，分類名稱一定會以文字顯示）
const STYLE: Record<string, { icon: string; tint: string }> = {
  餐飲: { icon: "🍜", tint: "bg-orange-50" },
  交通: { icon: "🚕", tint: "bg-sky-50" },
  購物: { icon: "🛍️", tint: "bg-pink-50" },
  娛樂: { icon: "🎬", tint: "bg-violet-50" },
  居住: { icon: "🏠", tint: "bg-amber-50" },
  醫療: { icon: "💊", tint: "bg-rose-50" },
  教育: { icon: "📚", tint: "bg-teal-50" },
  薪資: { icon: "💰", tint: "bg-emerald-50" },
  投資: { icon: "📈", tint: "bg-indigo-50" },
  其他: { icon: "🧾", tint: "bg-slate-100" },
};

export const categoryIcon = (c: string) => STYLE[c]?.icon ?? "🧾";
export const categoryTint = (c: string) => STYLE[c]?.tint ?? "bg-slate-100";
