import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PublicShell } from '@/components/public/PublicShell'
import { HomePageContent } from '@/features/public-pages/HomePage'
import { parseLocale } from '@/lib/i18n/locales'
import { buildPageMetadata } from '@/lib/seo/metadata'

type HomePageProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = parseLocale(localeParam)
  return locale ? buildPageMetadata(locale, 'home') : {}
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params
  const locale = parseLocale(localeParam)
  if (!locale) notFound()

  return (
    <PublicShell locale={locale}>
      <HomePageContent locale={locale} />
    </PublicShell>
  )
}
