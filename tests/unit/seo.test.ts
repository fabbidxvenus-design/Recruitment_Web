import { describe, expect, test } from 'vitest'
import { buildLocalizedMetadata } from '@/lib/seo/metadata'

describe('metadata helpers', () => {
  test('AC-07 returns Vietnamese home metadata', () => {
    const metadata = buildLocalizedMetadata('vi', 'home')

    expect(metadata.title).toContain('Tuyển dụng')
    expect(metadata.description).toContain('Fabbi')
    expect(metadata.openGraph?.locale).toBe('vi_VN')
  })

  test('AC-07 returns Japanese home metadata', () => {
    const metadata = buildLocalizedMetadata('jp', 'home')

    expect(metadata.title).toContain('採用')
    expect(metadata.description).toContain('Fabbi')
    expect(metadata.openGraph?.locale).toBe('ja_JP')
  })
})
