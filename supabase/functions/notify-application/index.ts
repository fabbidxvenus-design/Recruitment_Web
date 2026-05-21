declare const Deno: {
  env: { get: (key: string) => string | undefined }
  serve: (handler: (request: Request) => Response | Promise<Response>) => void
}

type NotificationPayload = {
  applicationId?: string
  candidateName?: string
  candidateEmail?: string
  targetPosition?: string
  submittedAt?: string
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' }
  })
}

function validatePayload(payload: NotificationPayload): string | null {
  if (!payload.applicationId) return 'MISSING_APPLICATION_ID'
  if (!payload.candidateName) return 'MISSING_CANDIDATE_NAME'
  if (!payload.candidateEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(payload.candidateEmail)) return 'INVALID_CANDIDATE_EMAIL'
  if (!payload.targetPosition) return 'MISSING_TARGET_POSITION'
  if (!payload.submittedAt) return 'MISSING_SUBMITTED_AT'
  return null
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return json({ success: false, errorCode: 'METHOD_NOT_ALLOWED' }, 405)
  }

  const hrRecipient = Deno.env.get('HR_NOTIFICATION_EMAIL')
  const providerApiKey = Deno.env.get('NOTIFICATION_PROVIDER_API_KEY')

  if (!hrRecipient || !providerApiKey) {
    return json({ success: false, errorCode: 'NOTIFICATION_CONFIG_MISSING' }, 503)
  }

  try {
    const payload = await request.json() as NotificationPayload
    const payloadError = validatePayload(payload)
    if (payloadError) return json({ success: false, errorCode: payloadError }, 400)

    console.info('notify-application', { applicationId: payload.applicationId, status: 'queued' })

    const response = await fetch('https://api.resend.com/emails', {
      body: JSON.stringify({
        from: Deno.env.get('NOTIFICATION_FROM_EMAIL') ?? hrRecipient,
        to: hrRecipient,
        subject: `New application: ${payload.targetPosition}`,
        text: `A new application was submitted. Application ID: ${payload.applicationId}`
      }),
      headers: {
        authorization: `Bearer ${providerApiKey}`,
        'content-type': 'application/json'
      },
      method: 'POST'
    })

    if (!response.ok) return json({ success: false, errorCode: 'PROVIDER_FAILED' }, 502)

    const providerResponse = await response.json() as { id?: string }
    return json({ success: true, providerMessageId: providerResponse.id })
  } catch {
    return json({ success: false, errorCode: 'INVALID_JSON' }, 400)
  }
})
