import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('auth_session');
  
  const { pathname } = request.nextUrl;

 
  const isPublicPath = pathname === '/login' || pathname === '/';

  if (!sessionCookie) {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    const role = session.role;

    
    if (isPublicPath && pathname === '/login') {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }

   
    if (pathname.startsWith('/admin') && role !== 'admin' && role !== 'superadmin') {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }

    if (pathname.startsWith('/superadmin') && role !== 'superadmin') {
      return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }

    if (pathname.startsWith('/user') && role !== 'user' && role !== 'admin' && role !== 'superadmin') {
      return NextResponse.redirect(new URL(`/login`, request.url));
    }

    if (pathname === '/') {
       return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
    }

    return NextResponse.next();
  } catch (error) {
  
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth_session');
    return response;
  }
}


export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
