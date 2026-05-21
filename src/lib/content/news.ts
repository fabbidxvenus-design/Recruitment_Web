import type { Locale } from '@/lib/i18n/locales'

type NewsStatus = 'draft' | 'published' | 'archived'

export type PublicNews = {
  slug: string
  status: NewsStatus
  category: Record<Locale, string>
  title: Record<Locale, string>
  excerpt: Record<Locale, string>
  body: Record<Locale, string[]>
  publishedAt: string
  readTime: Record<Locale, string>
  imageUrl: string
}

export const newsItems: PublicNews[] = [
  {
    slug: 'fabbi-strong-up',
    status: 'published',
    category: { vi: 'Người Fabbi', jp: 'Fabbiの人々' },
    title: { vi: 'Fabbi Strong Up: Hành trình kết nối đội ngũ công nghệ', jp: 'Fabbi Strong Up：技術チームをつなぐ旅' },
    excerpt: { vi: 'Những hoạt động nội bộ giúp đội ngũ Fabbi phát triển tinh thần đồng đội và văn hóa học hỏi.', jp: 'Fabbiチームの結束と学びの文化を育む社内活動。' },
    body: { vi: ['Fabbi Strong Up là chuỗi hoạt động giúp các thành viên kết nối, chia sẻ và cùng phát triển.', 'Sự kiện tập trung vào tinh thần đồng đội, sức khỏe và niềm tự hào khi tạo ra sản phẩm công nghệ chất lượng.'], jp: ['Fabbi Strong Upは、メンバーがつながり、共有し、共に成長するための活動です。', 'チームワーク、健康、品質の高い技術プロダクトへの誇りを大切にしています。'] },
    publishedAt: '11 Jan 2026',
    readTime: { vi: '5 phút đọc', jp: '5分で読めます' },
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbDjVEBWKZEpCceZ_bQvOIMwPo9mhRpNAlCrTnMt5RAczxG8qJRzpMOj3CDOlGt2k339qBJ5MLwJ5uSwARVDBqDtCkIAUK5H6jb_TFRot5yTnI4Rw5Up4wsX_P0V6g2ZDy-FAxITw5Do4WuiHVk1zKhxFXa17jUGkGtKXt353VowtXuS746DCAOdGxQJ-ILmqXHSYSrmKprguhSVd-ZHCtv3mZD6_fOfz_NBAnRZUjA78_h9SDp07N5k5fokZEdtBaMmf3fp_BYl4-'
  },
  {
    slug: 'engineering-culture',
    status: 'published',
    category: { vi: 'Các hoạt động', jp: '活動' },
    title: { vi: 'Văn hóa kỹ thuật tại Fabbi', jp: 'Fabbiのエンジニアリング文化' },
    excerpt: { vi: 'Cách Fabbi xây dựng môi trường học hỏi, review và cải tiến liên tục.', jp: '学び、レビュー、継続的改善を支えるFabbiの環境。' },
    body: { vi: ['Văn hóa kỹ thuật của Fabbi bắt đầu từ sự rõ ràng trong yêu cầu và sự chỉn chu khi triển khai.', 'Mỗi dự án là cơ hội để đội ngũ nâng cao chất lượng sản phẩm.'], jp: ['Fabbiの技術文化は、明確な要件と丁寧な実装から始まります。', '各プロジェクトは品質を高める機会です。'] },
    publishedAt: '20 Feb 2026',
    readTime: { vi: '4 phút đọc', jp: '4分で読めます' },
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKSoGcoxZdIxcUg7rMMU5Lh2N2EnffTl1k02E27vUBTIsU7Zy8rwI3anWg178Fbg3CRXJhRRU-xu1XkGHVSfoa_-1pX-SglWQOzcvwNwNJngRFaQvTO5n5dY59l52j1ljQHc5Tr1OP8lRFFdibbYLN-wzCoHoV93OXjfSF0roxRbSuZolws0HJM05wc7qogVQvCAtnQfs8YPQPOL7sC-lPuz8M_PYMrEC2P64vGM2IYMd_cgmpsMMG4yMXqiJ0-q5aCVDqbaAKnyag'
  },
  {
    slug: 'draft-news',
    status: 'draft',
    category: { vi: 'Draft', jp: 'ドラフト' },
    title: { vi: 'Draft', jp: 'ドラフト' },
    excerpt: { vi: 'Draft', jp: 'ドラフト' },
    body: { vi: [], jp: [] },
    publishedAt: '',
    readTime: { vi: '', jp: '' },
    imageUrl: ''
  }
]

export function listPublishedNews(locale: Locale): PublicNews[] {
  return newsItems.filter((item) => item.status === 'published' && item.title[locale])
}

export function getPublishedNewsBySlug(slug: string, locale: Locale): PublicNews | null {
  return newsItems.find((item) => item.slug === slug && item.status === 'published' && item.title[locale]) ?? null
}
