import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { adminSessionCookieName, parseAdminSession } from './src/lib/auth/session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')
  const isLoginRoute = pathname === '/admin/login'
  const isAdminApiRoute = pathname.startsWith('/api/admin/')

  if ((isAdminRoute && !isLoginRoute) || isAdminApiRoute) {
    const session = parseAdminSession(request.cookies.get(adminSessionCookieName())?.value)
    if (!session) {
      if (isAdminApiRoute) return NextResponse.json({ success: false, data: null, error: { code: 'ADMIN_REQUIRED', message: 'Access denied' } }, { status: 401 })
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
}
