import { describe, expect, test } from 'vitest'
import { buildCvObjectPath, validateApplicationInput, validateNotificationPayload } from '@/lib/applications/validation'

describe('Phase 03 application validation', () => {
  const baseInput = {
    fullName: 'Nguyen Van A',
    email: 'candidate@example.com',
    phone: '0912345678',
    targetPosition: 'Full Stack Engineer',
    yearsOfExperience: '3',
    portfolioUrl: 'https://example.com/profile',
    coverLetter: 'I want to join Fabbi.',
    cv: new File(['%PDF-1.4'], 'candidate.pdf', { type: 'application/pdf' })
  }

  test('accepts valid application fields and PDF under 5MB', () => {
    const result = validateApplicationInput(baseInput)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.cv.originalFilename).toBe('candidate.pdf')
      expect(result.data.cv.mimeType).toBe('application/pdf')
    }
  })

  test('rejects non-PDF CV before storage', () => {
    const result = validateApplicationInput({
      ...baseInput,
      cv: new File(['hello'], 'candidate.txt', { type: 'text/plain' })
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.fieldErrors?.cv).toMatch(/PDF/i)
    }
  })

  test('rejects oversized PDF before storage', () => {
    const bytes = new Uint8Array(5 * 1024 * 1024 + 1)
    const result = validateApplicationInput({
      ...baseInput,
      cv: new File([bytes], 'large.pdf', { type: 'application/pdf' })
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.fieldErrors?.cv).toMatch(/5MB/i)
    }
  })

  test('builds private CV object path without public URL', () => {
    expect(buildCvObjectPath('app-123', 'cv-456')).toBe('applications/app-123/cv-456.pdf')
  })

  test('validates safe notification payload shape', () => {
    expect(validateNotificationPayload({
      applicationId: 'app-123',
      candidateName: 'Nguyen Van A',
      candidateEmail: 'candidate@example.com',
      targetPosition: 'Full Stack Engineer',
      submittedAt: '2026-05-21T00:00:00.000Z'
    }).success).toBe(true)
  })
})
