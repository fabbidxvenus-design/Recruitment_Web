import type { ActionResult, NotificationPayload, ValidatedApplicationInput } from './types'

const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024
const PDF_MIME_TYPE = 'application/pdf'

interface RawApplicationInput {
  fullName?: unknown
  email?: unknown
  phone?: unknown
  targetPosition?: unknown
  yearsOfExperience?: unknown
  portfolioUrl?: unknown
  coverLetter?: unknown
  cv?: unknown
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function hasPdfExtension(fileName: string): boolean {
  return fileName.toLowerCase().endsWith('.pdf')
}

function isFile(value: unknown): value is File {
  return typeof File !== 'undefined' && value instanceof File
}

function failure(fieldErrors: Record<string, string>, message = 'Application input is invalid'): ActionResult<ValidatedApplicationInput> {
  return { success: false, data: null, error: { code: 'VALIDATION_ERROR', message, fieldErrors } }
}

export function validateApplicationInput(input: RawApplicationInput): ActionResult<ValidatedApplicationInput> {
  const fieldErrors: Record<string, string> = {}
  const fullName = asString(input.fullName)
  const email = asString(input.email)
  const phone = asString(input.phone)
  const targetPosition = asString(input.targetPosition)
  const portfolioUrl = asString(input.portfolioUrl)
  const coverLetter = asString(input.coverLetter)
  const yearsRaw = asString(input.yearsOfExperience)
  const yearsOfExperience = Number(yearsRaw)

  if (!fullName) fieldErrors.fullName = 'Full name is required'
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) fieldErrors.email = 'Valid email is required'
  if (!phone) fieldErrors.phone = 'Phone is required'
  if (!targetPosition) fieldErrors.targetPosition = 'Target position is required'
  if (!Number.isFinite(yearsOfExperience) || yearsOfExperience < 0 || yearsOfExperience > 60) fieldErrors.yearsOfExperience = 'Years of experience must be between 0 and 60'
  if (portfolioUrl && !/^https?:\/\//.test(portfolioUrl)) fieldErrors.portfolioUrl = 'Portfolio URL must start with http:// or https://'

  if (!isFile(input.cv)) {
    fieldErrors.cv = 'CV PDF is required'
  } else if (input.cv.type !== PDF_MIME_TYPE || !hasPdfExtension(input.cv.name)) {
    fieldErrors.cv = 'CV must be a PDF file'
  } else if (input.cv.size > MAX_CV_SIZE_BYTES) {
    fieldErrors.cv = 'CV must be 5MB or smaller'
  }

  if (Object.keys(fieldErrors).length > 0) return failure(fieldErrors)

  const cv = input.cv as File
  return {
    success: true,
    data: {
      fullName,
      email,
      phone,
      targetPosition,
      yearsOfExperience,
      portfolioUrl: portfolioUrl || null,
      coverLetter: coverLetter || null,
      cv: {
        file: cv,
        originalFilename: cv.name,
        mimeType: cv.type,
        sizeBytes: cv.size
      }
    },
    error: null
  }
}

export function buildCvObjectPath(applicationId: string, cvFileId: string): string {
  return `applications/${applicationId}/${cvFileId}.pdf`
}

export function validateNotificationPayload(payload: Partial<NotificationPayload>): ActionResult<NotificationPayload> {
  const fieldErrors: Record<string, string> = {}
  const applicationId = asString(payload.applicationId)
  const candidateName = asString(payload.candidateName)
  const candidateEmail = asString(payload.candidateEmail)
  const targetPosition = asString(payload.targetPosition)
  const submittedAt = asString(payload.submittedAt)

  if (!applicationId) fieldErrors.applicationId = 'Application ID is required'
  if (!candidateName) fieldErrors.candidateName = 'Candidate name is required'
  if (!candidateEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(candidateEmail)) fieldErrors.candidateEmail = 'Valid candidate email is required'
  if (!targetPosition) fieldErrors.targetPosition = 'Target position is required'
  if (!submittedAt || Number.isNaN(Date.parse(submittedAt))) fieldErrors.submittedAt = 'Valid submitted timestamp is required'

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, data: null, error: { code: 'INVALID_NOTIFICATION_PAYLOAD', message: 'Notification payload is invalid', fieldErrors } }
  }

  return { success: true, data: { applicationId, candidateName, candidateEmail, targetPosition, submittedAt }, error: null }
}
