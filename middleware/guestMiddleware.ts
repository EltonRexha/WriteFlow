import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function guestMiddleware(req: NextRequest) {
  const token = await getToken({ req });
  const url = req.nextUrl.pathname;
  
  if (token && !url.startsWith('/auth/sign-out')) {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  return NextResponse.next();
}
