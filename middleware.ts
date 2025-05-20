import { authMiddleware } from './middleware/authMiddleware';
import type { NextRequest } from 'next/server';
import { guestMiddleware } from './middleware/guestMiddleware';

const protectedRoutes = ['/home', '/drafts', '/user'];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  //Routes which should be authenticated
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    pathname !== '/'
  ) {
    return authMiddleware(req);
  }

  if (pathname.startsWith('/auth')) {
    return guestMiddleware(req);
  }
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
