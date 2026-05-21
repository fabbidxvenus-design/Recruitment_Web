import { notFound } from 'next/navigation'
import { getHtmlLang, parseLocale } from '@/lib/i18n/locales'

type LocaleLayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: localeParam } = await params
  const locale = parseLocale(localeParam)

  if (!locale) {
    notFound()
  }

  return (
    <html lang={getHtmlLang(locale)}>
      <body>{children}</body>
    </html>
  )
}
