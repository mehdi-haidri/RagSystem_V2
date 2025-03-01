import { DbConnection } from "@/db/DbConnection";
import User from "@/models/User";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await DbConnection();
  const { token, email, newPassword } = await req.json();

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    email,
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return Response.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  return Response.json({ message: "Password reset successful" }, { status: 200 });
}
