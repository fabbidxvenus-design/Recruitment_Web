import { describe, expect, test } from 'vitest'
import { createAdminContentService, validateJobInput, validateNewsInput } from '@/lib/admin/content'
import { validateSettingsInput } from '@/lib/admin/settings'

describe('Phase 04 admin content actions', () => {
  test('denies jobs mutations without admin access', async () => {
    const service = createAdminContentService({
      requireAdmin: async () => ({ success: false, data: null, error: { code: 'ADMIN_REQUIRED', message: 'Access denied' } }),
      createJobRecord: async () => ({ id: 'job-1' })
    })

    const result = await service.createJob({ slug: 'frontend', titleVi: 'Frontend', summaryVi: 'Build UI', descriptionVi: 'Build UI', location: 'Ha Noi', employmentType: 'Full Time' })

    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.code).toBe('ADMIN_REQUIRED')
  })

  test('validates required job and news fields', () => {
    expect(validateJobInput({ slug: 'bad slug', titleVi: '', summaryVi: '', descriptionVi: '', location: '', employmentType: '' }).success).toBe(false)
    expect(validateNewsInput({ slug: 'bad slug', titleVi: '', excerptVi: '', bodyVi: '' }).success).toBe(false)
  })

  test('validates settings email and locale', () => {
    const result = validateSettingsInput({ hrNotificationEmail: 'bad-email', defaultLocale: 'en', siteName: '', cvPolicyTextVi: '' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.fieldErrors?.hrNotificationEmail).toBeTruthy()
      expect(result.error.fieldErrors?.defaultLocale).toBeTruthy()
    }
  })
})
