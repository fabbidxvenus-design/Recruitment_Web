import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PublicShell } from '@/components/public/PublicShell'
import { AboutPageContent } from '@/features/public-pages/AboutPage'
import { parseLocale } from '@/lib/i18n/locales'
import { buildPageMetadata } from '@/lib/seo/metadata'

type PageProps = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = parseLocale(localeParam)
  return locale ? buildPageMetadata(locale, 'about') : {}
}

export default async function AboutPage({ params }: PageProps) {
  const { locale: localeParam } = await params
  const locale = parseLocale(localeParam)
  if (!locale) notFound()

  return (
    <PublicShell locale={locale}>
      <AboutPageContent locale={locale} />
    </PublicShell>
  )
}
