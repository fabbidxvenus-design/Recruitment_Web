import { describe, expect, test } from 'vitest'
import { filterPublishedJobs, getPublishedJobBySlug } from '@/lib/content/jobs'
import { getPublishedNewsBySlug, listPublishedNews } from '@/lib/content/news'

describe('public content helpers', () => {
  test('AC-03 lists only published jobs', () => {
    expect(filterPublishedJobs({ locale: 'vi' }).every((job) => job.status === 'published')).toBe(true)
  })

  test('AC-04 filters jobs by localized keyword', () => {
    const jobs = filterPublishedJobs({ locale: 'vi', q: 'frontend' })

    expect(jobs).toHaveLength(1)
    expect(jobs[0]?.slug).toBe('frontend-engineer')
  })

  test('AC-05 returns published job by slug only', () => {
    expect(getPublishedJobBySlug('full-stack-engineer')).not.toBeNull()
    expect(getPublishedJobBySlug('draft-role')).toBeNull()
  })

  test('AC-06 lists only published news', () => {
    expect(listPublishedNews('vi').every((item) => item.status === 'published')).toBe(true)
  })

  test('AC-07 returns published news by slug only', () => {
    expect(getPublishedNewsBySlug('fabbi-strong-up', 'vi')).not.toBeNull()
    expect(getPublishedNewsBySlug('draft-news', 'vi')).toBeNull()
  })
})
