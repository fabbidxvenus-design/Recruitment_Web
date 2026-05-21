import { describe, expect, test } from 'vitest'
import { defaultLocale, getAlternateLocalePath, getDictionary, isLocale, locales, parseLocale } from '@/lib/i18n/locales'

describe('locale helpers', () => {
  test('AC-04 uses Vietnamese as default locale', () => {
    expect(defaultLocale).toBe('vi')
    expect(locales).toEqual(['vi', 'jp'])
  })

  test('AC-06 validates supported locales only', () => {
    expect(isLocale('vi')).toBe(true)
    expect(isLocale('jp')).toBe(true)
    expect(isLocale('en')).toBe(false)
    expect(parseLocale('en')).toBeNull()
  })

  test('AC-05 returns localized navigation dictionaries', () => {
    expect(getDictionary('vi').navigation.jobs).toBe('Việc làm')
    expect(getDictionary('jp').navigation.jobs).toBe('求人')
  })

  test('AC-05 builds equivalent alternate locale paths', () => {
    expect(getAlternateLocalePath('/vi/jobs', 'jp')).toBe('/jp/jobs')
    expect(getAlternateLocalePath('/jp/news/post-1', 'vi')).toBe('/vi/news/post-1')
  })
})
