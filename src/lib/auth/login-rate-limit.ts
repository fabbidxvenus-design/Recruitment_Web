import { createClient } from '@supabase/supabase-js'

const LOGIN_ATTEMPT_LIMIT = 5
const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000
const localLoginAttempts = new Map<string, { count: number; resetAt: number }>()

interface LoginAttemptRow {
  attempt_count: number
  reset_at: string
}

function getOptionalSupabaseConfig(): { url: string; serviceRoleKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  return url && serviceRoleKey ? { url, serviceRoleKey } : null
}

function createSupabaseAdminClient() {
  const config = getOptionalSupabaseConfig()
  if (!config) return null

  return createClient(config.url, config.serviceRoleKey, {
    auth: { persistSession: false }
  })
}

function isLocalRateLimited(key: string, now: number): boolean {
  const attempt = localLoginAttempts.get(key)
  if (!attempt || attempt.resetAt <= now) {
    localLoginAttempts.set(key, { count: 1, resetAt: now + LOGIN_ATTEMPT_WINDOW_MS })
    return false
  }

  const nextAttempt = { ...attempt, count: attempt.count + 1 }
  localLoginAttempts.set(key, nextAttempt)
  return nextAttempt.count > LOGIN_ATTEMPT_LIMIT
}

export async function isLoginRateLimited(key: string, now = Date.now()): Promise<boolean> {
  const supabase = createSupabaseAdminClient()
  if (!supabase) return isLocalRateLimited(key, now)

  const { data } = await supabase
    .from('admin_login_attempts')
    .select('attempt_count, reset_at')
    .eq('client_key', key)
    .maybeSingle<LoginAttemptRow>()

  const resetAt = data ? new Date(data.reset_at).getTime() : 0
  const attemptCount = data && resetAt > now ? data.attempt_count + 1 : 1
  const nextResetAt = resetAt > now ? resetAt : now + LOGIN_ATTEMPT_WINDOW_MS

  await supabase
    .from('admin_login_attempts')
    .upsert({ client_key: key, attempt_count: attemptCount, reset_at: new Date(nextResetAt).toISOString() })

  return attemptCount > LOGIN_ATTEMPT_LIMIT
}

export async function clearLoginRateLimit(key: string): Promise<void> {
  localLoginAttempts.delete(key)
  const supabase = createSupabaseAdminClient()
  if (supabase) await supabase.from('admin_login_attempts').delete().eq('client_key', key)
}
