import { createClient } from '@supabase/supabase-js'

interface CvFileRecord {
  bucket: string
  mime_type: string
  object_path: string
  original_filename: string
}

interface AdminCvDownload {
  body: ArrayBuffer
  filename: string
  mimeType: string
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

export async function downloadAdminCv(cvFileId: string): Promise<AdminCvDownload | null> {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('cv_files')
    .select('bucket, mime_type, object_path, original_filename')
    .eq('id', cvFileId)
    .single<CvFileRecord>()

  if (error || !data) return null

  const download = await supabase.storage.from(data.bucket).download(data.object_path)
  if (download.error) return null

  return {
    body: await download.data.arrayBuffer(),
    filename: data.original_filename,
    mimeType: data.mime_type
  }
}
