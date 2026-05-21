import { expect, test } from '@playwright/test'

test.describe('Phase 03 application flow', () => {
  test('renders apply page with position selection and form fields', async ({ page }) => {
    await page.goto('/vi/apply')

    await expect(page.getByRole('heading', { name: /Chọn vị trí ứng tuyển/i })).toBeVisible()
    await expect(page.getByLabel(/Họ và tên/i)).toBeVisible()
    await expect(page.getByLabel(/CV PDF/i)).toBeVisible()
  })

  test('rejects invalid CV type through API before storage', async ({ request }) => {
    const formData = new FormData()
    formData.set('fullName', 'Nguyen Van A')
    formData.set('email', 'candidate@example.com')
    formData.set('phone', '0912345678')
    formData.set('targetPosition', 'Full Stack Engineer')
    formData.set('yearsOfExperience', '3')
    formData.set('cv', new File(['hello'], 'candidate.txt', { type: 'text/plain' }))

    const response = await request.post('/api/applications', { multipart: formData })
    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error.fieldErrors.cv).toMatch(/PDF/i)
  })
})
