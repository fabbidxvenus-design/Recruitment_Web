import { createHmac, timingSafeEqual } from 'crypto'

const ADMIN_SESSION_COOKIE = 'admin_session'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8

interface AdminSessionPayload {
  email: string
  role: 'admin'
  exp: number
}

function getRequiredSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not configured')
  return secret
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value).toString('base64url')
}

function decodeBase64Url(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function sign(value: string): string {
  return createHmac('sha256', getRequiredSessionSecret()).update(value).digest('base64url')
}

export function createAdminSession(email: string, now = Date.now()): string {
  const payload: AdminSessionPayload = {
    email,
    role: 'admin',
    exp: now + SESSION_MAX_AGE_SECONDS * 1000
  }
  const encodedPayload = encodeBase64Url(JSON.stringify(payload))
  return `${encodedPayload}.${sign(encodedPayload)}`
}

export function parseAdminSession(value: string | undefined, now = Date.now()): AdminSessionPayload | null {
  if (!value) return null

  const [encodedPayload, signature] = value.split('.')
  if (!encodedPayload || !signature) return null

  const expectedSignature = sign(encodedPayload)
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) return null

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as AdminSessionPayload
    if (payload.role !== 'admin' || payload.exp < now) return null
    return payload
  } catch {
    return null
  }
}

export function adminSessionCookieName(): string {
  return ADMIN_SESSION_COOKIE
}

export function adminSessionMaxAgeSeconds(): number {
  return SESSION_MAX_AGE_SECONDS
}
