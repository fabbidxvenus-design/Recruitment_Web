import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PublicShell } from '@/components/public/PublicShell'
import { JobDetailPageContent } from '@/features/jobs/JobDetailPage'
import { getPublishedJobBySlug } from '@/lib/content/jobs'
import { parseLocale } from '@/lib/i18n/locales'
import { buildJobMetadata, buildJobPostingJsonLd } from '@/lib/seo/metadata'

type PageProps = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params
  const locale = parseLocale(localeParam)
  const job = getPublishedJobBySlug(slug)
  return locale && job ? buildJobMetadata(job, locale) : {}
}

export default async function JobDetailPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params
  const locale = parseLocale(localeParam)
  if (!locale) notFound()
  const job = getPublishedJobBySlug(slug)
  if (!job) notFound()

  const jsonLd = buildJobPostingJsonLd(job, locale)

  return (
    <PublicShell locale={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <JobDetailPageContent job={job} locale={locale} />
    </PublicShell>
  )
}
