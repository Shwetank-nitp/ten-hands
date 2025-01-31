import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const cookie = await cookies();
  const token = cookie.get("token");
  const pathname = request.nextUrl.pathname.split("/")[1];
  console.log(
    request.nextUrl.pathname,
    " is trying to aceess with this token ",
    token
  );
  if ((pathname === "login" || pathname === "signup") && !token) {
    return NextResponse.next();
  } else if (pathname === "login" || pathname === "signup") {
    return NextResponse.redirect(new URL("/room", request.nextUrl.origin));
  }

  if (pathname === "room" && token) {
    return NextResponse.next();
  } else if (pathname === "room") {
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login", "/signup", "/room", "/room/:path*"],
};
