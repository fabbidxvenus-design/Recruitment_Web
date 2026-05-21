import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { ActionResult } from '@/lib/applications/types'
import type { AdminProfile } from './admin'
import { adminSessionCookieName, parseAdminSession } from './session'

export async function requireAdmin(): Promise<ActionResult<AdminProfile>> {
  const cookieStore = await cookies()
  const session = parseAdminSession(cookieStore.get(adminSessionCookieName())?.value)
  if (!session) return { success: false, data: null, error: { code: 'ADMIN_REQUIRED', message: 'Access denied' } }

  return { success: true, data: { email: session.email, role: 'admin' }, error: null }
}

export async function requireAdminPage(): Promise<void> {
  const admin = await requireAdmin()
  if (!admin.success) redirect('/admin/login')
}
