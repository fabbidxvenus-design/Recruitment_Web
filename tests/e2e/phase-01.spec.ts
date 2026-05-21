import { expect, test } from '@playwright/test'

test('AC-04 redirects root to Vietnamese default locale', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/vi$/)
})

test('AC-05 renders Japanese public shell', async ({ page }) => {
  await page.goto('/jp')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja')
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toContainText('求人')
})
