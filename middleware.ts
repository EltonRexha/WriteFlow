import { authMiddleware } from './middleware/authMiddleware';
import type { NextRequest } from 'next/server';
import { guestMiddleware } from './middleware/guestMiddleware';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith('/home') && pathname !== '/') {
    return authMiddleware(req);
  }

  if (pathname.startsWith('/auth')) {
    return guestMiddleware(req);
  }
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
