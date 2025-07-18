// middleware.ts
import { authOptions } from "@/lib/auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: authOptions.secret });

  const isAuth = !!token;
  const userRole = token?.role as string | undefined;

  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  if (!isAuth && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin/dashboard")) {
    if (userRole !== "admin" && userRole !== "worker") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  if (pathname.startsWith("/admin/users")) {
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register"],
};
