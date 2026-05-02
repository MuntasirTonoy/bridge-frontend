import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // If user is logged in and tries to access the login page (/), redirect to /chat
  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/chat", req.url));
    }
  }

  // If user is NOT logged in and tries to access chat pages, redirect to /
  if (pathname.startsWith("/chat")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/chat/:path*"],
};
