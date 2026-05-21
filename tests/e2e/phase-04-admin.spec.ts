import { expect, test } from '@playwright/test'

test.describe('Phase 04 admin access control', () => {
  test('renders generic admin login for unauthenticated users', async ({ page }) => {
    await page.goto('/admin/login')

    await expect(page.getByRole('heading', { name: /Admin Login|Đăng nhập CMS/i })).toBeVisible()
    await expect(page.getByLabel(/Email/i)).toBeVisible()
    await expect(page.getByLabel(/Password/i)).toBeVisible()
  })

  test('denies unauthenticated CV access', async ({ request }) => {
    const response = await request.get('/api/admin/cv/00000000-0000-0000-0000-000000000000')

    expect(response.status()).toBe(401)
  })
})
