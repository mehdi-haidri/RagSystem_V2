import bcrypt from "bcryptjs";
import { DbConnection } from "@/db/DbConnection";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();
    await DbConnection();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return Response.json({ message: "User registered successfully" }, { status: 201 });

  } catch (error) {
    return Response.json({ error: "Registration failed" }, { status: 500 });
  }
}
