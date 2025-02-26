import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { DbConnection } from "@/db/DbConnection";
import User from "@/models/User";
import "dotenv/config";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await DbConnection();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("User not found");
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        return { id: user._id, email: user.email, name: user.username };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        // Handle Google sign-in
        await DbConnection();
        let existingUser = await User.findOne({ email: profile.email });

        if (!existingUser) {
          const randomPassword = Math.random().toString(36).slice(-16);
          const hashedPassword = await bcrypt.hash(randomPassword, 10);

          // Create a new user for Google sign-in
          existingUser = await User.create({
            email: profile.email,
            username: profile.name || profile.email.split("@")[0],
            password: hashedPassword,
            provider: "google",
          });
        }

        user.id = existingUser._id;
      
      }

      // For credentials sign-in, no additional logic is needed here
      return true; // Allow sign-in
    },

    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/" }, // Redirect unauthenticated users to login page
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
