import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/', '/login', '/register', '/posts'];

  const protectedRoutes = ['/dashboard', '/profile', '/posts/create', '/posts/edit'];
  
  const adminRoutes = ['/admin', '/admin/users', '/admin/posts'];

  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith('/posts/') && !pathname.includes('/edit')
  );

  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/posts/create',
    '/posts/edit/:path*',
    '/admin/:path*',
  ],
}; 