import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/home", "/drafts", "/user", "/dashboard"];
const guestRoutes = ["/auth/sign-in", "/auth/sign-up"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const token = await getToken({
    req,
  });

  // Protected route but not authenticated
  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !token) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  // Guest route but authenticated
  if (guestRoutes.some((r) => pathname.startsWith(r)) && token) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
