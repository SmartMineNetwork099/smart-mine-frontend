import { NextRequest, NextResponse } from "next/server";

const skipRoutes = ["/auth/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

    // API routes skip
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Next.js internals aur static files skip
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    /\.(png|jpg|jpeg|svg|gif|webp|ico|css|js|map)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const isSkipRoute = skipRoutes.includes(pathname);

  // user login nahi hai
  if (!token && !isSkipRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // user login hai aur login page par aa gaya
  if (token && pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/stacking/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};