// 全部用 "YYYY-MM-DD" 字串當日期 key，避免時區換算出錯
const pad = (n: number) => String(n).padStart(2, "0");

export const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayKey = () => toKey(new Date());
export const monthOf = (dateKey: string) => dateKey.slice(0, 7);

export function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

export function daysInMonth(month: string) {
  const [y, m] = month.split("-").map(Number);
  const count = new Date(y, m, 0).getDate();
  return Array.from({ length: count }, (_, i) => `${month}-${pad(i + 1)}`);
}

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
export const weekdayOf = (dateKey: string) => {
  const [y, m, d] = dateKey.split("-").map(Number);
  return WEEKDAYS[new Date(y, m - 1, d).getDay()];
};

export const formatMonth = (month: string) => {
  const [y, m] = month.split("-").map(Number);
  return `${y} 年 ${m} 月`;
};

export const money = (n: number) => n.toLocaleString("zh-TW", { maximumFractionDigits: 2 });
