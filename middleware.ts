import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/home", "/drafts", "/user", "/dashboard"];
const guestRoutes = ["/auth/sign-in", "/auth/sign-up"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = await getToken({ req });

  //Authenticated route but the user is not authenticated
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  //Guest route but the user is authenticated
  if (guestRoutes.some((route) => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  //Neither guest nor authenticated route so just continue
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
