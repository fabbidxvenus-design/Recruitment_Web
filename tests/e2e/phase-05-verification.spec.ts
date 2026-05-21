import { expect, test } from '@playwright/test'

test.describe('Phase 05 MVP verification hardening', () => {
  test('candidate can discover a job and open its detail page', async ({ page }) => {
    await page.goto('/vi/jobs?q=full')

    await expect(page.getByRole('heading', { name: /Full Stack Engineer/i })).toBeVisible()
    await page.locator('article', { hasText: 'Full Stack Engineer' }).getByRole('link', { name: /Xem chi tiết/i }).click()

    await expect(page).toHaveURL(/\/vi\/jobs\/full-stack-engineer/)
    await expect(page.getByRole('heading', { name: /Full Stack Engineer/i })).toBeVisible()
  })

  test('job detail includes localized metadata and JobPosting JSON-LD', async ({ page }) => {
    await page.goto('/jp/jobs/full-stack-engineer')

    await expect(page).toHaveTitle(/フルスタックエンジニア.*Fabbi/)
    const description = page.locator('meta[name="description"]')
    await expect(description).toHaveAttribute('content', /Webプロダクト|Webシステム/)
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent()
    expect(jsonLd).toContain('JobPosting')
    expect(jsonLd).toContain('フルスタックエンジニア')
  })

  test('application API rejects oversized CV before storage', async ({ request }) => {
    const oversizedPdf = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'candidate.pdf', { type: 'application/pdf' })
    const formData = new FormData()
    formData.set('fullName', 'Nguyen Van A')
    formData.set('email', 'candidate@example.com')
    formData.set('phone', '0912345678')
    formData.set('targetPosition', 'Full Stack Engineer')
    formData.set('yearsOfExperience', '3')
    formData.set('cv', oversizedPdf)

    const response = await request.post('/api/applications', { multipart: formData })
    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error.fieldErrors.cv).toMatch(/5MB/i)
  })

  test('unauthenticated users are redirected away from CMS pages', async ({ browser }) => {
    const context = await browser.newContext({ baseURL: 'http://127.0.0.1:3000', storageState: { cookies: [], origins: [] } })
    const page = await context.newPage()
    await page.goto('/admin/jobs')

    await expect(page).toHaveURL(/\/admin\/login/)
    await expect(page.getByRole('heading', { name: /Admin Login|Đăng nhập CMS/i })).toBeVisible()
    await context.close()
  })

  test('public navigation and application form are keyboard and label accessible', async ({ page }) => {
    await page.goto('/vi/apply')

    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('navigation')).toBeVisible()
    await expect(page.getByLabel(/Họ và tên/i)).toBeVisible()
    await expect(page.getByLabel(/CV PDF/i)).toBeVisible()

    await page.keyboard.press('Tab')
    const activeElementName = await page.evaluate(() => document.activeElement?.tagName)
    expect(activeElementName).toMatch(/^(A|INPUT|SELECT|TEXTAREA|BUTTON)$/)
  })

  test('robots and sitemap expose intentional SEO policies', async ({ request }) => {
    const robots = await request.get('/robots.txt')
    expect(robots.status()).toBe(200)
    const robotsBody = await robots.text()
    expect(robotsBody).toContain('Disallow: /admin')
    expect(robotsBody).toContain('Sitemap: http://localhost:3000/sitemap.xml')

    const sitemap = await request.get('/sitemap.xml')
    expect(sitemap.status()).toBe(200)
    const sitemapBody = await sitemap.text()
    expect(sitemapBody).toContain('/vi/jobs/full-stack-engineer')
    expect(sitemapBody).not.toContain('/vi/jobs/draft-role')
  })
})
