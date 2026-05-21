import type { MetadataRoute } from 'next'
import { buildRobotsPolicy } from '@/lib/seo/metadata'

export default function robots(): MetadataRoute.Robots {
  return buildRobotsPolicy()
}
