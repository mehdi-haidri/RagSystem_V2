import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { DbConnection } from "@/db/DbConnection";
import User from "@/models/User";
import "dotenv/config";

async function refreshAccessToken(token) {
  try {
    await DbConnection();
    const user = await User.findById(token.id);

    const refreshToken = token.refreshToken || user?.refreshToken;
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const url = "https://oauth2.googleapis.com/token";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const refreshedTokens = await response.json();
    if (!response.ok) throw refreshedTokens;

    // Save new refresh token if provided
    if (refreshedTokens.refresh_token) {
      user.refreshToken = refreshedTokens.refresh_token;
      await user.save();
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token || refreshToken, // Use new or existing token
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}


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

        return { id: user._id, email: user.email, name: user.username  };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          access_type: "offline", // Requests a refresh token
          prompt: "consent", // Forces Google to ask for permissions again
        },
      },
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        await DbConnection();
        let existingUser = await User.findOne({ email: profile.email });
    
        if (!existingUser) {
          const randomPassword = Math.random().toString(36).slice(-16);
          const hashedPassword = await bcrypt.hash(randomPassword, 10);
          
          existingUser = await User.create({
            email: profile.email,
            username: profile.name || profile.email.split("@")[0],
            password: hashedPassword,
            provider: "google",
            refreshToken: account.refresh_token, // Store refresh token
          });
        } else if (account.refresh_token) {
          // Update stored refresh token if a new one is provided
          existingUser.refreshToken = account.refresh_token;
          await existingUser.save();
        }
    
        user.id = existingUser._id;
        user.image = profile.picture;
      }
    
      return true;
    },
    

    async jwt({ token, user, account }) {
      // If signing in, update the token with new values
      console.log("Account:", account);
      if (account) {
        token.id = user.id;
        token.provider = account.provider;
    
        if (account.provider === "google") {
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token; // Save refresh token
          token.accessTokenExpires = Date.now() + account.expires_in * 1000;
        }
      }
    
      // If token is expired, refresh it (even on sign-in)
      if (token.provider === "google" && Date.now() > token.accessTokenExpires) {
        return await refreshAccessToken(token);
      }
    
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.provider = token.provider;
      if (token.provider === "google") {
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/" }, // Redirect unauthenticated users to login page
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
