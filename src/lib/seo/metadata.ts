import type { Metadata, MetadataRoute } from 'next'
import { jobs, type PublicJob } from '@/lib/content/jobs'
import { newsItems, type PublicNews } from '@/lib/content/news'
import { getDictionary, type Locale } from '@/lib/i18n/locales'

type PublicPageKey = 'home' | 'about' | 'jobs' | 'apply' | 'news'

interface PageMetadataCopy {
  title: string
  description: string
}

type JobPostingJsonLd = {
  '@context': 'https://schema.org'
  '@type': 'JobPosting'
  title: string
  description: string
  datePosted?: string
  validThrough?: string
  employmentType: string
  hiringOrganization: {
    '@type': 'Organization'
    name: string
    sameAs: string
  }
  jobLocation: {
    '@type': 'Place'
    address: {
      '@type': 'PostalAddress'
      addressLocality: string
      addressCountry: string
    }
  }
  url: string
}

const openGraphLocales: Record<Locale, string> = {
  vi: 'vi_VN',
  jp: 'ja_JP'
}

function getSiteUrl(): string {
  const url = new URL(process.env.SITE_URL ?? 'http://localhost:3000')
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('SITE_URL must use http or https')
  return url.origin
}

const siteUrl = getSiteUrl()

const pageMetadata: Record<PublicPageKey, Record<Locale, PageMetadataCopy>> = {
  home: {
    vi: { title: 'Tuyển dụng Fabbi', description: 'Khám phá cơ hội nghề nghiệp, văn hóa và hành trình phát triển tại Fabbi.' },
    jp: { title: 'Fabbi採用', description: 'Fabbiの求人、文化、成長機会をご覧ください。' }
  },
  about: {
    vi: { title: 'Về Fabbi', description: 'Tìm hiểu văn hóa, hoạt động và giá trị tại Fabbi.' },
    jp: { title: 'Fabbiについて', description: 'Fabbiの文化、活動、価値観を紹介します。' }
  },
  jobs: {
    vi: { title: 'Việc làm tại Fabbi', description: 'Các vị trí tuyển dụng đang mở tại Fabbi cho kỹ sư, cầu nối và đội ngũ công nghệ.' },
    jp: { title: 'Fabbiの求人', description: 'Fabbiで募集中のエンジニア、ブリッジ、テクノロジー職種をご覧ください。' }
  },
  apply: {
    vi: { title: 'Ứng tuyển | Fabbi', description: 'Chọn vị trí phù hợp và gửi hồ sơ PDF để HR Fabbi liên hệ.' },
    jp: { title: '応募 | Fabbi', description: '希望する求人を選択し、PDF履歴書を送信してください。' }
  },
  news: {
    vi: { title: 'Tin tức Fabbi', description: 'Cập nhật hoạt động, văn hóa và câu chuyện đội ngũ Fabbi.' },
    jp: { title: 'Fabbiニュース', description: 'Fabbiの活動、文化、チームストーリーをお届けします。' }
  }
}

function publicUrl(path: string): string {
  return `${siteUrl}${path}`
}

function metadataFor(locale: Locale, title: string, description: string, path: string, imageUrl?: string): Metadata {
  const url = publicUrl(path)
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      locale: openGraphLocales[locale],
      type: 'website',
      url
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      description,
      images: imageUrl ? [imageUrl] : undefined,
      title
    }
  }
}

function parseDate(value: string): string | undefined {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined
}

export function buildLocalizedMetadata(locale: Locale, page: 'home'): Metadata {
  const dictionary = getDictionary(locale)
  const pageMetadata = dictionary.pages[page]

  return {
    title: pageMetadata.title,
    description: pageMetadata.description,
    openGraph: {
      title: pageMetadata.title,
      description: pageMetadata.description,
      locale: openGraphLocales[locale],
      type: 'website'
    }
  }
}

export function buildPageMetadata(locale: Locale, page: PublicPageKey): Metadata {
  const copy = pageMetadata[page][locale]
  const path = page === 'home' ? `/${locale}` : `/${locale}/${page}`
  return metadataFor(locale, copy.title, copy.description, path)
}

export function buildJobMetadata(job: PublicJob, locale: Locale): Metadata {
  return metadataFor(locale, `${job.title[locale]} | Fabbi`, job.summary[locale], `/${locale}/jobs/${job.slug}`, job.imageUrl)
}

export function buildNewsMetadata(item: PublicNews, locale: Locale): Metadata {
  return metadataFor(locale, `${item.title[locale]} | Fabbi`, item.excerpt[locale], `/${locale}/news/${item.slug}`, item.imageUrl)
}

export function buildJobPostingJsonLd(job: PublicJob, locale: Locale): JobPostingJsonLd {
  const validThrough = parseDate(job.expiresAt)
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title[locale],
    description: `${job.description[locale]} ${job.requirements[locale].join(' ')}`,
    datePosted: parseDate(job.publishedAt),
    validThrough,
    employmentType: job.employmentType.toUpperCase().replaceAll(' ', '_'),
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Fabbi',
      sameAs: siteUrl
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'VN'
      }
    },
    url: publicUrl(`/${locale}/jobs/${job.slug}`)
  }
}

export function buildSitemapEntries(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = (['vi', 'jp'] as Locale[]).flatMap((locale) => [
    { url: publicUrl(`/${locale}`) },
    { url: publicUrl(`/${locale}/about`) },
    { url: publicUrl(`/${locale}/jobs`) },
    { url: publicUrl(`/${locale}/apply`) },
    { url: publicUrl(`/${locale}/news`) }
  ])

  const jobRoutes: MetadataRoute.Sitemap = jobs
    .filter((job) => job.status === 'published')
    .flatMap((job) => (['vi', 'jp'] as Locale[]).map((locale) => ({ url: publicUrl(`/${locale}/jobs/${job.slug}`) })))

  const newsRoutes: MetadataRoute.Sitemap = newsItems
    .filter((item) => item.status === 'published')
    .flatMap((item) => (['vi', 'jp'] as Locale[]).map((locale) => ({ url: publicUrl(`/${locale}/news/${item.slug}`) })))

  return [...staticRoutes, ...jobRoutes, ...newsRoutes]
}

export function buildRobotsPolicy(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/admin/', '/api'] }],
    sitemap: publicUrl('/sitemap.xml')
  }
}
