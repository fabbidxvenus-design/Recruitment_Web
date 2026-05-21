import { describe, expect, test, vi } from 'vitest'

describe('Phase 04 admin session', () => {
  test('parses a signed admin session', async () => {
    vi.resetModules()
    vi.stubEnv('ADMIN_SESSION_SECRET', 'test-secret')
    const { createAdminSession, parseAdminSession } = await import('@/lib/auth/session')
    const session = createAdminSession('admin@example.com', 1_000)

    expect(parseAdminSession(session, 2_000)?.email).toBe('admin@example.com')

    vi.unstubAllEnvs()
  })

  test('rejects tampered sessions', async () => {
    vi.resetModules()
    vi.stubEnv('ADMIN_SESSION_SECRET', 'test-secret')
    const { createAdminSession, parseAdminSession } = await import('@/lib/auth/session')
    const session = createAdminSession('admin@example.com', 1_000)

    expect(parseAdminSession(`${session}tampered`, 2_000)).toBeNull()

    vi.unstubAllEnvs()
  })
})
