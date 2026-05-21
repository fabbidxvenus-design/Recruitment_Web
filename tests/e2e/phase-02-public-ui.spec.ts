import { expect, test } from '@playwright/test'

const routes = ['/vi', '/vi/about', '/vi/jobs', '/vi/jobs/full-stack-engineer', '/vi/news', '/vi/news/fabbi-strong-up']

test.describe('Phase 02 public UI routes', () => {
  for (const route of routes) {
    test(`${route} renders public design shell`, async ({ page }) => {
      await page.goto(route)
      await expect(page.getByRole('banner')).toBeVisible()
      await expect(page.getByRole('heading').first()).toBeVisible()
      await expect(page.getByRole('contentinfo')).toBeVisible()
    })
  }

  test('AC-04 filters jobs by keyword', async ({ page }) => {
    await page.goto('/vi/jobs?q=frontend')
    await expect(page.getByRole('heading', { name: /Frontend Engineer/i })).toBeVisible()
    await expect(page.getByText(/Full Stack Engineer/i)).toHaveCount(0)
  })

  test('AC-08 public page has no horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 })
    await page.goto('/vi/jobs')

    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    expect(hasOverflow).toBe(false)
  })
})
