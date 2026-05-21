import type { ReactNode } from 'react'
import type { Locale } from '@/lib/i18n/locales'
import { PublicFooter } from './PublicFooter'
import { PublicHeader } from './PublicHeader'

type PublicShellProps = {
  children: ReactNode
  locale: Locale
}

export function PublicShell({ children, locale }: PublicShellProps) {
  return (
    <>
      <PublicHeader locale={locale} />
      <main>{children}</main>
      <PublicFooter locale={locale} />
    </>
  )
}
