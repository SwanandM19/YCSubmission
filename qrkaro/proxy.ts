// middleware.ts (root of project)
import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'admin_session';   // ✅ matches auth/route.ts exactly
const SESSION_VALUE  = 'authenticated';   // ✅ matches auth/route.ts exactly

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = req.cookies.get(SESSION_COOKIE)?.value;

    if (session !== SESSION_VALUE) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Already logged in → skip login page
  if (pathname.startsWith('/admin/login')) {
    const session = req.cookies.get(SESSION_COOKIE)?.value;
    if (session === SESSION_VALUE) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};