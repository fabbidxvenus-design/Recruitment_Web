import { NextResponse } from 'next/server'
import { createSupabaseApplicationService } from '@/lib/applications/supabase-service'
import { validateApplicationInput } from '@/lib/applications/validation'

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX_SUBMISSIONS = 5
const submissionsByClient = new Map<string, number[]>()

function clientKey(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const fallbackKey = request.headers.get('origin') || request.headers.get('user-agent') || crypto.randomUUID()
  return forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || fallbackKey
}

function isRateLimited(key: string, now = Date.now()): boolean {
  const recentSubmissions = (submissionsByClient.get(key) ?? []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)

  for (const [client, timestamps] of submissionsByClient) {
    const retainedTimestamps = timestamps.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)
    if (retainedTimestamps.length === 0) {
      submissionsByClient.delete(client)
    } else if (retainedTimestamps.length !== timestamps.length) {
      submissionsByClient.set(client, retainedTimestamps)
    }
  }

  const updatedSubmissions = [...recentSubmissions, now]
  submissionsByClient.set(key, updatedSubmissions)
  return updatedSubmissions.length > RATE_LIMIT_MAX_SUBMISSIONS
}

export async function POST(request: Request) {
  if (isRateLimited(clientKey(request))) {
    return NextResponse.json({ success: false, data: null, error: { code: 'RATE_LIMITED', message: 'Too many submissions. Please try again later.' } }, { status: 429 })
  }

  const formData = await request.formData()
  const input = {
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    targetPosition: formData.get('targetPosition'),
    yearsOfExperience: formData.get('yearsOfExperience'),
    portfolioUrl: formData.get('portfolioUrl'),
    coverLetter: formData.get('coverLetter'),
    cv: formData.get('cv')
  }
  const validation = validateApplicationInput(input)

  if (!validation.success) {
    return NextResponse.json(validation, { status: 400 })
  }

  const service = createSupabaseApplicationService()
  const result = await service.submitApplication(input)

  return NextResponse.json(result, { status: result.success ? 201 : 400 })
}
