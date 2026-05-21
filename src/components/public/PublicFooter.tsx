import type { Locale } from '@/lib/i18n/locales'

type PublicFooterProps = {
  locale: Locale
}

export function PublicFooter({ locale }: PublicFooterProps) {
  return (
    <footer className="public-footer">
      <p>© Fabbi Careers</p>
      <p>{locale === 'vi' ? 'Cơ hội nghề nghiệp tại Fabbi' : 'Fabbiの採用情報'}</p>
    </footer>
  )
}
