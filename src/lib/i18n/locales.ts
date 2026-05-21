export const locales = ['vi', 'jp'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'vi'

export type Dictionary = {
  navigation: {
    home: string
    about: string
    jobs: string
    news: string
    apply: string
  }
  actions: {
    switchToVietnamese: string
    switchToJapanese: string
  }
  pages: {
    home: {
      title: string
      description: string
      eyebrow: string
      heading: string
      body: string
      cta: string
    }
  }
}

const dictionaries: Record<Locale, Dictionary> = {
  vi: {
    navigation: {
      home: 'Trang chủ',
      about: 'Về Fabbi',
      jobs: 'Việc làm',
      news: 'Tin tức',
      apply: 'Ứng tuyển'
    },
    actions: {
      switchToVietnamese: 'Tiếng Việt',
      switchToJapanese: '日本語'
    },
    pages: {
      home: {
        title: 'Tuyển dụng Fabbi',
        description: 'Khám phá cơ hội nghề nghiệp tại Fabbi và ứng tuyển vị trí phù hợp.',
        eyebrow: 'Fabbi Careers',
        heading: 'Cùng Fabbi tạo nên sản phẩm công nghệ có giá trị',
        body: 'Nền tảng tuyển dụng giúp ứng viên tìm hiểu văn hóa, vị trí mở và gửi hồ sơ nhanh chóng.',
        cta: 'Khám phá việc làm'
      }
    }
  },
  jp: {
    navigation: {
      home: 'ホーム',
      about: 'Fabbiについて',
      jobs: '求人',
      news: 'ニュース',
      apply: '応募'
    },
    actions: {
      switchToVietnamese: 'Tiếng Việt',
      switchToJapanese: '日本語'
    },
    pages: {
      home: {
        title: 'Fabbi 採用',
        description: 'Fabbiの採用情報を確認し、自分に合うポジションへ応募できます。',
        eyebrow: 'Fabbi Careers',
        heading: 'Fabbiで価値あるテクノロジーを共につくる',
        body: '候補者が文化、募集職種、応募フローを分かりやすく確認できる採用サイトです。',
        cta: '求人を見る'
      }
    }
  }
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function parseLocale(value: string | undefined): Locale | null {
  return value && isLocale(value) ? value : null
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}

export function getHtmlLang(locale: Locale): string {
  return locale === 'jp' ? 'ja' : 'vi'
}

export function getAlternateLocalePath(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split('/').filter(Boolean)
  const [, ...rest] = isLocale(segments[0] ?? '') ? segments : [defaultLocale, ...segments]

  return `/${[targetLocale, ...rest].join('/')}`
}
