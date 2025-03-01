import { DbConnection } from "@/db/DbConnection";
import User from "@/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";
import "dotenv/config";

export async function POST(req) {
  await DbConnection();
  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return Response.json({ error: "Email not found" }, { status: 404 });
  }

  // Generate a reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
  const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // Token expires in 10 min

  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpires = resetTokenExpires;
  await user.save();

  // Send email
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}&email=${email}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
  return Response.json({ message: "Reset link sent to email" }, { status: 200 });
}
