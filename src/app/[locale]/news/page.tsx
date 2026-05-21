import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PublicShell } from '@/components/public/PublicShell'
import { NewsListPageContent } from '@/features/news/NewsListPage'
import { parseLocale } from '@/lib/i18n/locales'
import { buildPageMetadata } from '@/lib/seo/metadata'

type PageProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = parseLocale(localeParam)
  return locale ? buildPageMetadata(locale, 'news') : {}
}

export default async function NewsPage({ params }: PageProps) {
  const { locale: localeParam } = await params
  const locale = parseLocale(localeParam)
  if (!locale) notFound()

  return (
    <PublicShell locale={locale}>
      <NewsListPageContent locale={locale} />
    </PublicShell>
  )
}
