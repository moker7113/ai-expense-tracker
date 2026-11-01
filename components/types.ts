export type PublicUser = { id: string; email: string; name: string; role: "user" | "admin" };

export type Item = {
  _id: string;
  type: "expense" | "income";
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string; // ISO，前 10 碼即 YYYY-MM-DD
};
