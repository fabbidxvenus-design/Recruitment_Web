import type { Locale } from '@/lib/i18n/locales'

export const publicCopy = {
  vi: {
    home: {
      heroTitle: 'Cùng Fabbi tạo nên sản phẩm công nghệ có giá trị',
      heroBody: 'Gia nhập đội ngũ kỹ sư, nhà thiết kế và chuyên gia sản phẩm đang xây dựng giải pháp cho thị trường Nhật Bản.',
      stats: ['2018 Thành lập', '5 Chi nhánh', '300+ Dự án', '200+ Nhân viên'],
      cta: 'Khám phá việc làm'
    },
    about: {
      title: 'Về Fabbi',
      intro: 'Fabbi là công ty công nghệ tập trung vào chất lượng sản phẩm, văn hóa học hỏi và kết nối con người.',
      story: 'Chúng tôi đồng hành cùng khách hàng Nhật Bản trong hành trình xây dựng sản phẩm số, đồng thời tạo môi trường để mỗi thành viên phát triển bền vững.'
    }
  },
  jp: {
    home: {
      heroTitle: 'Fabbiで価値あるテクノロジーを共につくる',
      heroBody: '日本市場向けのプロダクトを支えるエンジニア、デザイナー、プロダクトチームに参加しませんか。',
      stats: ['2018 設立', '5 拠点', '300+ プロジェクト', '200+ メンバー'],
      cta: '求人を見る'
    },
    about: {
      title: 'Fabbiについて',
      intro: 'Fabbiは品質、学びの文化、人のつながりを大切にするテクノロジー企業です。',
      story: '日本のお客様のデジタルプロダクト開発を支援しながら、メンバーが長期的に成長できる環境をつくっています。'
    }
  }
} satisfies Record<Locale, { home: { heroTitle: string; heroBody: string; stats: string[]; cta: string }; about: { title: string; intro: string; story: string } }>
