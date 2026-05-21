import { createClient } from '@supabase/supabase-js'
import { createApplicationService } from './service'
import type { NotificationResult, ValidatedApplicationInput } from './types'

interface ApplicationRow {
  id: string
  created_at: string
}

interface CvFileRow {
  id: string
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not configured`)
  return value
}

function createSupabaseAdminClient() {
  return createClient(getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'), getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false }
  })
}

async function notifyHr(payload: {
  applicationId: string
  candidateName: string
  candidateEmail: string
  targetPosition: string
  submittedAt: string
}): Promise<NotificationResult> {
  const functionUrl = process.env.SUPABASE_NOTIFY_APPLICATION_URL
  const functionKey = process.env.SUPABASE_NOTIFY_APPLICATION_KEY

  if (!functionUrl || !functionKey) return { success: false, errorCode: 'NOTIFICATION_CONFIG_MISSING' }

  try {
    const response = await fetch(functionUrl, {
      body: JSON.stringify(payload),
      headers: {
        authorization: `Bearer ${functionKey}`,
        'content-type': 'application/json'
      },
      method: 'POST'
    })
    const result = await response.json() as NotificationResult
    return response.ok ? result : { success: false, errorCode: result.errorCode ?? 'NOTIFICATION_FAILED' }
  } catch {
    return { success: false, errorCode: 'NOTIFICATION_FAILED' }
  }
}

export function createSupabaseApplicationService() {
  const supabase = createSupabaseAdminClient()
  const bucket = process.env.SUPABASE_CV_BUCKET ?? 'candidate-cvs'

  return createApplicationService({
    async insertApplication(input: ValidatedApplicationInput) {
      const { data, error } = await supabase
        .from('applications')
        .insert({
          cover_letter: input.coverLetter,
          email: input.email,
          full_name: input.fullName,
          phone: input.phone,
          portfolio_url: input.portfolioUrl,
          target_position: input.targetPosition,
          years_of_experience: input.yearsOfExperience
        })
        .select('id, created_at')
        .single<ApplicationRow>()

      if (error) throw error
      return { id: data.id, createdAt: data.created_at }
    },
    async uploadCv(applicationId, cvFileId, file) {
      const objectPath = `applications/${applicationId}/${cvFileId}.pdf`
      const { error } = await supabase.storage.from(bucket).upload(objectPath, file, {
        contentType: 'application/pdf',
        upsert: false
      })
      if (error) throw error
      return { cvFileId, objectPath }
    },
    async insertCvMetadata(metadata) {
      const { error } = await supabase
        .from('cv_files')
        .insert({
          application_id: metadata.applicationId,
          bucket: metadata.bucket,
          id: metadata.cvFileId,
          mime_type: metadata.mimeType,
          object_path: metadata.objectPath,
          original_filename: metadata.originalFilename,
          size_bytes: metadata.sizeBytes
        })
        .select('id')
        .single<CvFileRow>()
      if (error) throw error
    },
    notifyHr,
    async updateNotificationStatus(applicationId, status, errorCode) {
      const { error } = await supabase
        .from('applications')
        .update({ notification_error: errorCode ?? null, notification_status: status })
        .eq('id', applicationId)
      if (error) throw error
    },
    async removeCvObject(objectPath) {
      await supabase.storage.from(bucket).remove([objectPath])
    }
  })
}
