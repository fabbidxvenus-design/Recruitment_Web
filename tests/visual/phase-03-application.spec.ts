import { expect, test } from '@playwright/test'

const viewports = [
  { width: 375, height: 900 },
  { width: 768, height: 1024 },
  { width: 1024, height: 900 },
  { width: 1440, height: 1000 }
]

const routes = ['/vi/apply', '/jp/apply']

test.describe('Phase 03 application visual coverage', () => {
  for (const route of routes) {
    for (const viewport of viewports) {
      test(`${route} at ${viewport.width}px`, async ({ page }) => {
        await page.setViewportSize(viewport)
        await page.goto(route)
        await expect(page.getByRole('heading', { name: /Chọn vị trí ứng tuyển|応募ポジションを選択/i })).toBeVisible()
        await expect(page.getByLabel(/Họ và tên|氏名/i)).toBeVisible()
        await page.screenshot({ fullPage: true, path: `coding-packs/plans/reports/visual${route.replaceAll('/', '-')}-${viewport.width}.png` })
      })
    }
  }
})
