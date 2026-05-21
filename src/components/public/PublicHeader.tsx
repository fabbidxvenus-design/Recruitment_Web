import Link from 'next/link'
import { getAlternateLocalePath, getDictionary, type Locale } from '@/lib/i18n/locales'

type PublicHeaderProps = {
  locale: Locale
  pathname?: string
}

export function PublicHeader({ locale, pathname = `/${locale}` }: PublicHeaderProps) {
  const dictionary = getDictionary(locale)
  const alternateLocale = locale === 'vi' ? 'jp' : 'vi'
  const alternatePath = getAlternateLocalePath(pathname, alternateLocale)

  const navItems = [
    { href: `/${locale}`, label: dictionary.navigation.home },
    { href: `/${locale}/about`, label: dictionary.navigation.about },
    { href: `/${locale}/jobs`, label: dictionary.navigation.jobs },
    { href: `/${locale}/news`, label: dictionary.navigation.news },
    { href: `/${locale}/apply`, label: dictionary.navigation.apply }
  ]

  return (
    <header className="public-header">
      <Link className="public-logo" href={`/${locale}`}>
        Fabbi Careers
      </Link>
      <nav aria-label="Main navigation" className="public-nav">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="language-switcher" href={alternatePath}>
        {alternateLocale === 'vi' ? dictionary.actions.switchToVietnamese : dictionary.actions.switchToJapanese}
      </Link>
    </header>
  )
}
