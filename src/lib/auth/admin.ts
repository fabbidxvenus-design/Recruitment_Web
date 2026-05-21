import type { ActionResult } from '@/lib/applications/types'

export interface AdminUser {
  id: string
  email: string
}

export interface AdminProfile {
  email: string
  role: 'admin'
}

interface SignInInput {
  email?: unknown
  password?: unknown
}

interface AdminAuthDependencies {
  getCurrentUser: () => Promise<AdminUser | null>
  getAdminProfile: (userId: string) => Promise<AdminProfile | null>
  signInWithPassword?: (input: { email: string; password: string }) => Promise<{ success: boolean }>
}

function genericDenied(): ActionResult<AdminProfile> {
  return { success: false, data: null, error: { code: 'ADMIN_REQUIRED', message: 'Access denied' } }
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function createAdminAuthService(dependencies: AdminAuthDependencies) {
  return {
    async requireAdmin(): Promise<ActionResult<AdminProfile>> {
      const user = await dependencies.getCurrentUser()
      if (!user) return genericDenied()

      const profile = await dependencies.getAdminProfile(user.id)
      if (!profile || profile.role !== 'admin') return genericDenied()

      return { success: true, data: profile, error: null }
    },
    async signInAdmin(input: SignInInput): Promise<ActionResult<AdminProfile>> {
      const email = asString(input.email)
      const password = asString(input.password)

      if (!email || !password || !dependencies.signInWithPassword) {
        return { success: false, data: null, error: { code: 'INVALID_LOGIN', message: 'Invalid email or password' } }
      }

      const signIn = await dependencies.signInWithPassword({ email, password })
      if (!signIn.success) {
        return { success: false, data: null, error: { code: 'INVALID_LOGIN', message: 'Invalid email or password' } }
      }

      return this.requireAdmin()
    }
  }
}
