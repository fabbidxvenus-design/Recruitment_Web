import { notFound } from 'next/navigation'
import { PublicShell } from '@/components/public/PublicShell'
import { JobsPageContent } from '@/features/jobs/JobsPage'
import type { Metadata } from 'next'
import { parseLocale } from '@/lib/i18n/locales'
import { buildPageMetadata } from '@/lib/seo/metadata'

type PageProps = { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = parseLocale(localeParam)
  return locale ? buildPageMetadata(locale, 'jobs') : {}
}

export default async function JobsPage({ params, searchParams }: PageProps) {
  const { locale: localeParam } = await params
  const resolvedSearchParams = await searchParams
  const locale = parseLocale(localeParam)
  if (!locale) notFound()

  return (
    <PublicShell locale={locale}>
      <JobsPageContent locale={locale} query={resolvedSearchParams.q} />
    </PublicShell>
  )
}
