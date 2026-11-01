import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false }, // bcrypt 雜湊，預設查詢不帶出
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user", required: true },
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof userSchema>;

export const UserModel: Model<User> =
  (mongoose.models.User as Model<User>) ?? mongoose.model<User>("User", userSchema);
