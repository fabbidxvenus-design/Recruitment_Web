import { buildCvObjectPath, validateApplicationInput } from './validation'
import type { ActionResult, NotificationResult, NotificationStatus, ValidatedApplicationInput } from './types'

interface StoredApplication {
  id: string
  createdAt: string
}

interface UploadedCv {
  cvFileId: string
  objectPath: string
}

interface SubmitApplicationResult {
  applicationId: string
  notificationStatus: NotificationStatus
}

interface ApplicationServiceDependencies {
  insertApplication: (input: ValidatedApplicationInput) => Promise<StoredApplication>
  uploadCv: (applicationId: string, cvFileId: string, file: File) => Promise<UploadedCv>
  insertCvMetadata: (metadata: { applicationId: string; cvFileId: string; bucket: string; objectPath: string; originalFilename: string; mimeType: string; sizeBytes: number }) => Promise<void>
  notifyHr: (payload: { applicationId: string; candidateName: string; candidateEmail: string; targetPosition: string; submittedAt: string }) => Promise<NotificationResult>
  updateNotificationStatus: (applicationId: string, status: NotificationStatus, errorCode?: string) => Promise<unknown>
  removeCvObject?: (objectPath: string) => Promise<void>
  createId?: () => string
}

export function createApplicationService(dependencies: ApplicationServiceDependencies) {
  const createId = dependencies.createId ?? (() => crypto.randomUUID())

  return {
    async submitApplication(input: Parameters<typeof validateApplicationInput>[0]): Promise<ActionResult<SubmitApplicationResult>> {
      const validation = validateApplicationInput(input)
      if (!validation.success) return validation

      let storedApplication: StoredApplication | null = null
      let uploadedCv: UploadedCv | null = null

      try {
        storedApplication = await dependencies.insertApplication(validation.data)
        const cvFileId = createId()
        const expectedObjectPath = buildCvObjectPath(storedApplication.id, cvFileId)
        uploadedCv = await dependencies.uploadCv(storedApplication.id, cvFileId, validation.data.cv.file)
        const objectPath = uploadedCv.objectPath || expectedObjectPath

        await dependencies.insertCvMetadata({
          applicationId: storedApplication.id,
          cvFileId,
          bucket: 'candidate-cvs',
          objectPath,
          originalFilename: validation.data.cv.originalFilename,
          mimeType: validation.data.cv.mimeType,
          sizeBytes: validation.data.cv.sizeBytes
        })

        const notification = await dependencies.notifyHr({
          applicationId: storedApplication.id,
          candidateName: validation.data.fullName,
          candidateEmail: validation.data.email,
          targetPosition: validation.data.targetPosition,
          submittedAt: storedApplication.createdAt
        })
        const notificationStatus: NotificationStatus = notification.success ? 'sent' : 'failed'
        await dependencies.updateNotificationStatus(storedApplication.id, notificationStatus, notification.errorCode)

        return { success: true, data: { applicationId: storedApplication.id, notificationStatus }, error: null }
      } catch {
        if (uploadedCv?.objectPath && dependencies.removeCvObject) {
          await dependencies.removeCvObject(uploadedCv.objectPath)
        }
        return { success: false, data: null, error: { code: 'APPLICATION_SUBMIT_FAILED', message: 'Application could not be submitted. Please try again.' } }
      }
    }
  }
}
