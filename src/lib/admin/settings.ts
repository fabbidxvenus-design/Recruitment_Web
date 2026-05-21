import type { ActionResult } from '@/lib/applications/types'

export interface SettingsInput {
  hrNotificationEmail?: unknown
  defaultLocale?: unknown
  siteName?: unknown
  cvPolicyTextVi?: unknown
}

interface ValidatedSettingsInput {
  hrNotificationEmail: string
  defaultLocale: 'vi' | 'jp'
  siteName: string
  cvPolicyTextVi: string
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function validateSettingsInput(input: SettingsInput): ActionResult<ValidatedSettingsInput> {
  const fieldErrors: Record<string, string> = {}
  const hrNotificationEmail = asString(input.hrNotificationEmail)
  const defaultLocale = asString(input.defaultLocale)
  const siteName = asString(input.siteName)
  const cvPolicyTextVi = asString(input.cvPolicyTextVi)

  if (!hrNotificationEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(hrNotificationEmail)) fieldErrors.hrNotificationEmail = 'Valid HR email is required'
  if (defaultLocale !== 'vi' && defaultLocale !== 'jp') fieldErrors.defaultLocale = 'Default locale must be vi or jp'
  if (!siteName) fieldErrors.siteName = 'Site name is required'
  if (!cvPolicyTextVi) fieldErrors.cvPolicyTextVi = 'Vietnamese CV policy is required'

  if (Object.keys(fieldErrors).length > 0) return { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Settings input is invalid', fieldErrors } }

  const validatedLocale = defaultLocale as 'vi' | 'jp'
  return { success: true, data: { hrNotificationEmail, defaultLocale: validatedLocale, siteName, cvPolicyTextVi }, error: null }
}
