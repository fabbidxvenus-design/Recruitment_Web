import { expect, test } from '@playwright/test'
import { createAdminSession } from '@/lib/auth/session'

const viewports = [
  { width: 375, height: 900 },
  { width: 768, height: 1024 },
  { width: 1024, height: 900 },
  { width: 1440, height: 1000 }
]

const routes = ['/admin', '/admin/jobs', '/admin/news', '/admin/applications', '/admin/settings']

test.describe('Phase 04 admin visual coverage', () => {
  test.use({
    storageState: {
      cookies: [{
        name: 'admin_session',
        value: createAdminSession('admin@example.com', Date.now()),
        domain: '127.0.0.1',
        path: '/',
        expires: Math.floor(Date.now() / 1000) + 3600,
        httpOnly: true,
        secure: false,
        sameSite: 'Lax'
      }],
      origins: []
    }
  })

  for (const route of routes) {
    for (const viewport of viewports) {
      test(`${route} at ${viewport.width}px`, async ({ page }) => {
        await page.setViewportSize(viewport)
        await page.goto(route)
        await expect(page.getByText('Recruitment CMS').first()).toBeVisible()
        await expect(page.getByRole('heading').first()).toBeVisible()
        const routeKey = route.replaceAll('/', '-') || '-admin'
        await page.screenshot({ fullPage: true, path: `coding-packs/plans/reports/visual${routeKey}-${viewport.width}.png` })
      })
    }
  }
})
