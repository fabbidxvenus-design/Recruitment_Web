import { describe, expect, test } from 'vitest'
import { createAdminAuthService } from '@/lib/auth/admin'

describe('Phase 04 admin auth', () => {
  test('denies unauthenticated users before CMS data loads', async () => {
    const auth = createAdminAuthService({
      getCurrentUser: async () => null,
      getAdminProfile: async () => null
    })

    const result = await auth.requireAdmin()

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.code).toBe('ADMIN_REQUIRED')
    }
  })

  test('denies authenticated non-admin users', async () => {
    const auth = createAdminAuthService({
      getCurrentUser: async () => ({ id: 'user-1', email: 'user@example.com' }),
      getAdminProfile: async () => null
    })

    const result = await auth.requireAdmin()

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.message).toMatch(/access denied/i)
    }
  })

  test('returns admin identity for admins', async () => {
    const auth = createAdminAuthService({
      getCurrentUser: async () => ({ id: 'admin-1', email: 'admin@example.com' }),
      getAdminProfile: async () => ({ email: 'admin@example.com', role: 'admin' })
    })

    const result = await auth.requireAdmin()

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.role).toBe('admin')
    }
  })

  test('uses generic login failure messages', async () => {
    const auth = createAdminAuthService({
      getCurrentUser: async () => null,
      getAdminProfile: async () => null,
      signInWithPassword: async () => ({ success: false })
    })

    const result = await auth.signInAdmin({ email: 'missing@example.com', password: 'wrong-password' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.message).toBe('Invalid email or password')
    }
  })
})
