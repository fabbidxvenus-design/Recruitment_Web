export type ActionResult<T> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: { code: string; message: string; fieldErrors?: Record<string, string> } }

export type NotificationStatus = 'pending' | 'sent' | 'failed'

export interface ValidatedApplicationInput {
  fullName: string
  email: string
  phone: string
  targetPosition: string
  yearsOfExperience: number
  portfolioUrl: string | null
  coverLetter: string | null
  cv: {
    file: File
    originalFilename: string
    mimeType: string
    sizeBytes: number
  }
}

export interface NotificationPayload {
  applicationId: string
  candidateName: string
  candidateEmail: string
  targetPosition: string
  submittedAt: string
}

export interface NotificationResult {
  success: boolean
  providerMessageId?: string
  errorCode?: string
}
