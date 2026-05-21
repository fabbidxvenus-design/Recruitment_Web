import type { MetadataRoute } from 'next'
import { buildSitemapEntries } from '@/lib/seo/metadata'

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries()
}
