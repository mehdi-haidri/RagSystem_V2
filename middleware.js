import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If the user is not authenticated, redirect to the sign-in page
    if (!token) {
       return NextResponse.redirect(new URL("/", req.url));
  }
 
  
  // If the user is authenticated, continue to the requested page
  return NextResponse.next();
}

// Specify the routes you want to protect
export const config = {
    matcher: ["/chatbot/:path*"], // Protect all routes under /protected
};