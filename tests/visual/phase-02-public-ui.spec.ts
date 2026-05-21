import { expect, test } from '@playwright/test'

const viewports = [
  { width: 375, height: 900 },
  { width: 768, height: 1024 },
  { width: 1024, height: 900 },
  { width: 1440, height: 1000 }
]

const routes = ['/vi', '/vi/about', '/vi/jobs', '/vi/jobs/full-stack-engineer', '/vi/news', '/vi/news/fabbi-strong-up']

test.describe('Phase 02 visual coverage', () => {
  for (const route of routes) {
    for (const viewport of viewports) {
      test(`${route} at ${viewport.width}px`, async ({ page }) => {
        await page.setViewportSize(viewport)
        await page.goto(route)
        await expect(page.getByRole('banner')).toBeVisible()
        await expect(page.getByRole('heading').first()).toBeVisible()
        await page.screenshot({ fullPage: true, path: `coding-packs/plans/reports/visual${route.replaceAll('/', '-') || '-root'}-${viewport.width}.png` })
      })
    }
  }
})
