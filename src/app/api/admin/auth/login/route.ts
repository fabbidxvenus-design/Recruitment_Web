import { NextResponse } from 'next/server'
import { clearLoginRateLimit, isLoginRateLimited } from '@/lib/auth/login-rate-limit'
import { adminSessionCookieName, adminSessionMaxAgeSeconds, createAdminSession } from '@/lib/auth/session'

function genericLoginFailure() {
  return NextResponse.json({ success: false, data: null, error: { code: 'INVALID_LOGIN', message: 'Invalid email or password' } }, { status: 401 })
}

function rateLimitFailure() {
  return NextResponse.json({ success: false, data: null, error: { code: 'RATE_LIMITED', message: 'Too many login attempts' } }, { status: 429 })
}

function clientKey(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'local'
}

export async function POST(request: Request) {
  const key = clientKey(request)
  if (await isLoginRateLimited(key)) return rateLimitFailure()

  const formData = await request.formData()
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword || email !== adminEmail || password !== adminPassword) {
    return genericLoginFailure()
  }

  await clearLoginRateLimit(key)
  const response = NextResponse.redirect(new URL('/admin', request.url), { status: 303 })
  response.cookies.set(adminSessionCookieName(), createAdminSession(email), {
    httpOnly: true,
    maxAge: adminSessionMaxAgeSeconds(),
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  })
  return response
}
