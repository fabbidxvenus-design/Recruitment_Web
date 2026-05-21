import type { ActionResult } from '@/lib/applications/types'
import type { AdminProfile } from '@/lib/auth/admin'

type AdminResult = ActionResult<AdminProfile>

export interface JobInput {
  slug?: unknown
  titleVi?: unknown
  summaryVi?: unknown
  descriptionVi?: unknown
  location?: unknown
  employmentType?: unknown
}

export interface NewsInput {
  slug?: unknown
  titleVi?: unknown
  excerptVi?: unknown
  bodyVi?: unknown
}

interface AdminContentDependencies {
  requireAdmin: () => Promise<AdminResult>
  createJobRecord: (input: ValidatedJobInput) => Promise<{ id: string }>
  createNewsRecord?: (input: ValidatedNewsInput) => Promise<{ id: string }>
}

interface ValidatedJobInput {
  slug: string
  titleVi: string
  summaryVi: string
  descriptionVi: string
  location: string
  employmentType: string
}

interface ValidatedNewsInput {
  slug: string
  titleVi: string
  excerptVi: string
  bodyVi: string
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function isSafeSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

export function validateJobInput(input: JobInput): ActionResult<ValidatedJobInput> {
  const fieldErrors: Record<string, string> = {}
  const slug = asString(input.slug)
  const titleVi = asString(input.titleVi)
  const summaryVi = asString(input.summaryVi)
  const descriptionVi = asString(input.descriptionVi)
  const location = asString(input.location)
  const employmentType = asString(input.employmentType)

  if (!slug || !isSafeSlug(slug)) fieldErrors.slug = 'Slug must use lowercase letters, numbers, and hyphens'
  if (!titleVi) fieldErrors.titleVi = 'Vietnamese title is required'
  if (!summaryVi) fieldErrors.summaryVi = 'Vietnamese summary is required'
  if (!descriptionVi) fieldErrors.descriptionVi = 'Vietnamese description is required'
  if (!location) fieldErrors.location = 'Location is required'
  if (!employmentType) fieldErrors.employmentType = 'Employment type is required'

  if (Object.keys(fieldErrors).length > 0) return { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Job input is invalid', fieldErrors } }

  return { success: true, data: { slug, titleVi, summaryVi, descriptionVi, location, employmentType }, error: null }
}

export function validateNewsInput(input: NewsInput): ActionResult<ValidatedNewsInput> {
  const fieldErrors: Record<string, string> = {}
  const slug = asString(input.slug)
  const titleVi = asString(input.titleVi)
  const excerptVi = asString(input.excerptVi)
  const bodyVi = asString(input.bodyVi)

  if (!slug || !isSafeSlug(slug)) fieldErrors.slug = 'Slug must use lowercase letters, numbers, and hyphens'
  if (!titleVi) fieldErrors.titleVi = 'Vietnamese title is required'
  if (!excerptVi) fieldErrors.excerptVi = 'Vietnamese excerpt is required'
  if (!bodyVi) fieldErrors.bodyVi = 'Vietnamese body is required'

  if (Object.keys(fieldErrors).length > 0) return { success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'News input is invalid', fieldErrors } }

  return { success: true, data: { slug, titleVi, excerptVi, bodyVi }, error: null }
}

export function createAdminContentService(dependencies: AdminContentDependencies) {
  return {
    async createJob(input: JobInput): Promise<ActionResult<{ id: string }>> {
      const admin = await dependencies.requireAdmin()
      if (!admin.success) return admin

      const validation = validateJobInput(input)
      if (!validation.success) return validation

      const record = await dependencies.createJobRecord(validation.data)
      return { success: true, data: record, error: null }
    },
    async createNews(input: NewsInput): Promise<ActionResult<{ id: string }>> {
      const admin = await dependencies.requireAdmin()
      if (!admin.success) return admin

      const validation = validateNewsInput(input)
      if (!validation.success) return validation
      if (!dependencies.createNewsRecord) return { success: false, data: null, error: { code: 'NOT_CONFIGURED', message: 'News action is not configured' } }

      const record = await dependencies.createNewsRecord(validation.data)
      return { success: true, data: record, error: null }
    }
  }
}
