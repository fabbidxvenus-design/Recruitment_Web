import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PublicShell } from '@/components/public/PublicShell'
import { NewsDetailPageContent } from '@/features/news/NewsDetailPage'
import { getPublishedNewsBySlug } from '@/lib/content/news'
import { parseLocale } from '@/lib/i18n/locales'
import { buildNewsMetadata } from '@/lib/seo/metadata'

type PageProps = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params
  const locale = parseLocale(localeParam)
  const item = locale ? getPublishedNewsBySlug(slug, locale) : null
  return locale && item ? buildNewsMetadata(item, locale) : {}
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params
  const locale = parseLocale(localeParam)
  if (!locale) notFound()
  const item = getPublishedNewsBySlug(slug, locale)
  if (!item) notFound()

  return (
    <PublicShell locale={locale}>
      <NewsDetailPageContent item={item} locale={locale} />
    </PublicShell>
  )
}
