import { describe, expect, test } from 'vitest'
import { jobs } from '@/lib/content/jobs'
import { newsItems } from '@/lib/content/news'
import { buildJobPostingJsonLd, buildPageMetadata, buildSitemapEntries, buildRobotsPolicy } from '@/lib/seo/metadata'

describe('Phase 05 SEO coverage', () => {
  test('builds localized metadata for public pages', () => {
    const viJobs = buildPageMetadata('vi', 'jobs')
    const jpJobs = buildPageMetadata('jp', 'jobs')

    expect(viJobs.title).toContain('Việc làm')
    expect(viJobs.description).toContain('Fabbi')
    expect(viJobs.alternates?.canonical).toBe('http://localhost:3000/vi/jobs')
    expect(jpJobs.title).toContain('求人')
    expect(jpJobs.description).toContain('Fabbi')
    expect(jpJobs.openGraph?.locale).toBe('ja_JP')
  })

  test('builds JobPosting JSON-LD for published jobs', () => {
    const job = jobs.find((item) => item.slug === 'full-stack-engineer')
    if (!job) throw new Error('Expected full-stack-engineer fixture')

    const jsonLd = buildJobPostingJsonLd(job, 'vi')

    expect(jsonLd['@type']).toBe('JobPosting')
    expect(jsonLd.title).toBe(job.title.vi)
    expect(jsonLd.description).toContain(job.description.vi)
    expect(jsonLd.datePosted).toBe('2026-04-18')
    expect(jsonLd.validThrough).toBe('2026-04-20')
    expect(jsonLd.hiringOrganization.name).toBe('Fabbi')
    expect(jsonLd.url).toBe('http://localhost:3000/vi/jobs/full-stack-engineer')
  })

  test('sitemap includes localized published routes only', () => {
    const entries = buildSitemapEntries()
    const urls = entries.map((entry) => entry.url)

    expect(urls).toContain('http://localhost:3000/vi/jobs/full-stack-engineer')
    expect(urls).toContain('http://localhost:3000/jp/news/fabbi-strong-up')
    expect(urls).not.toContain('http://localhost:3000/vi/jobs/draft-role')
    expect(urls).not.toContain('http://localhost:3000/vi/news/draft-news')
    expect(urls.length).toBeGreaterThan(newsItems.filter((item) => item.status === 'published').length)
  })

  test('robots policy disallows private surfaces and references sitemap', () => {
    const robots = buildRobotsPolicy()

    expect(robots.rules).toEqual(expect.arrayContaining([
      expect.objectContaining({ userAgent: '*', allow: '/', disallow: ['/admin', '/admin/', '/api'] })
    ]))
    expect(robots.sitemap).toBe('http://localhost:3000/sitemap.xml')
  })
})
