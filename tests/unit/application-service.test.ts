import { describe, expect, test } from 'vitest'
import { createApplicationService } from '@/lib/applications/service'

describe('Phase 03 application service', () => {
  test('preserves stored application when notification fails', async () => {
    const service = createApplicationService({
      insertApplication: async () => ({ id: 'app-123', createdAt: '2026-05-21T00:00:00.000Z' }),
      uploadCv: async () => ({ cvFileId: 'cv-456', objectPath: 'applications/app-123/cv-456.pdf' }),
      insertCvMetadata: async () => undefined,
      notifyHr: async () => ({ success: false, errorCode: 'PROVIDER_FAILED' }),
      updateNotificationStatus: async (applicationId, status) => ({ applicationId, status })
    })

    const result = await service.submitApplication({
      fullName: 'Nguyen Van A',
      email: 'candidate@example.com',
      phone: '0912345678',
      targetPosition: 'Full Stack Engineer',
      yearsOfExperience: '3',
      portfolioUrl: '',
      coverLetter: '',
      cv: new File(['%PDF-1.4'], 'candidate.pdf', { type: 'application/pdf' })
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.applicationId).toBe('app-123')
      expect(result.data.notificationStatus).toBe('failed')
      expect(result.data).not.toHaveProperty('objectPath')
      expect(result.data).not.toHaveProperty('publicUrl')
    }
  })
})
