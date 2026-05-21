import type { Locale } from '@/lib/i18n/locales'

export type JobStatus = 'draft' | 'published' | 'archived'

export type PublicJob = {
  id: string
  slug: string
  status: JobStatus
  title: Record<Locale, string>
  summary: Record<Locale, string>
  description: Record<Locale, string>
  requirements: Record<Locale, string[]>
  benefits: Record<Locale, string[]>
  location: string
  employmentType: string
  department: string
  salaryRange: string
  tags: string[]
  publishedAgo: Record<Locale, string>
  publishedAt: string
  expiresAt: string
  imageUrl: string
}

export const jobs: PublicJob[] = [
  {
    id: 'job-full-stack',
    slug: 'full-stack-engineer',
    status: 'published',
    title: { vi: 'Full Stack Engineer', jp: 'フルスタックエンジニア' },
    summary: { vi: 'Phát triển sản phẩm web quy mô lớn với React, Node.js và nền tảng cloud.', jp: 'React、Node.js、クラウド基盤で大規模Webプロダクトを開発します。' },
    description: { vi: 'Tham gia thiết kế, phát triển và tối ưu các hệ thống web cho khách hàng Nhật Bản.', jp: '日本のお客様向けWebシステムの設計、開発、改善に参加します。' },
    requirements: { vi: ['Từ 3 năm kinh nghiệm phát triển web.', 'Thành thạo React và Node.js.', 'Có tư duy sản phẩm và làm việc nhóm tốt.'], jp: ['Web開発経験3年以上。', 'ReactとNode.jsに精通。', 'プロダクト志向とチームワーク。'] },
    benefits: { vi: ['Lương thưởng cạnh tranh.', 'Làm việc với khách hàng Nhật.', 'Đào tạo ngoại ngữ và kỹ thuật.'], jp: ['競争力のある給与。', '日本のお客様との開発経験。', '語学・技術研修。'] },
    location: 'Hà Nội',
    employmentType: 'Full Time',
    department: 'Engineering',
    salaryRange: 'Thương lượng',
    tags: ['React', 'Node.js', 'Cloud'],
    publishedAgo: { vi: '2 ngày trước', jp: '2日前' },
    publishedAt: '2026-04-18',
    expiresAt: '2026-04-20',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC63-BZr7u4LaMjP7x9ke6frUq2nD4wJozql_hVfz7-Kn050mB6I-kDZldAHFL7AmoVYtZqqKDUhUsYv_RuQZEx8VNWih93lnF3BMGg6AbcC0fgDgHnkR9D0RXZtxFGWOgT2fqnOQu95UGlANM4LmzTj6sL3d2B6TJ6QSFFj9_8TamviPY1Etr0Z7zl_ep99mG0sLR9Y_bSZwnceBCk9-2qBlFJ10MenbXr-rG3qoIIT3tme6o4HXJnZcpG5Z0Owe9F3j42AYrqHdKU'
  },
  {
    id: 'job-frontend',
    slug: 'frontend-engineer',
    status: 'published',
    title: { vi: 'Frontend Engineer', jp: 'フロントエンドエンジニア' },
    summary: { vi: 'Xây dựng giao diện tuyển dụng và dashboard CMS có độ hoàn thiện cao.', jp: '高品質な採用サイトとCMSダッシュボードUIを構築します。' },
    description: { vi: 'Tập trung vào UI fidelity, accessibility và hiệu năng cho các sản phẩm web.', jp: 'UI再現性、アクセシビリティ、パフォーマンスに注力します。' },
    requirements: { vi: ['Thành thạo React, CSS, TypeScript.', 'Có kinh nghiệm responsive UI.', 'Quan tâm đến chi tiết thiết kế.'], jp: ['React、CSS、TypeScriptに精通。', 'レスポンシブUI経験。', 'デザイン詳細へのこだわり。'] },
    benefits: { vi: ['Môi trường kỹ thuật mạnh.', 'Lộ trình phát triển rõ ràng.', 'Cơ hội làm sản phẩm quốc tế.'], jp: ['技術力の高い環境。', '明確な成長パス。', '国際プロダクト経験。'] },
    location: 'Đà Nẵng',
    employmentType: 'Full Time',
    department: 'Frontend',
    salaryRange: 'Up to 2000 USD',
    tags: ['Frontend', 'TypeScript', 'UI'],
    publishedAgo: { vi: '5 ngày trước', jp: '5日前' },
    publishedAt: '2026-04-15',
    expiresAt: '2026-04-30',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC63-BZr7u4LaMjP7x9ke6frUq2nD4wJozql_hVfz7-Kn050mB6I-kDZldAHFL7AmoVYtZqqKDUhUsYv_RuQZEx8VNWih93lnF3BMGg6AbcC0fgDgHnkR9D0RXZtxFGWOgT2fqnOQu95UGlANM4LmzTj6sL3d2B6TJ6QSFFj9_8TamviPY1Etr0Z7zl_ep99mG0sLR9Y_bSZwnceBCk9-2qBlFJ10MenbXr-rG3qoIIT3tme6o4HXJnZcpG5Z0Owe9F3j42AYrqHdKU'
  },
  {
    id: 'job-draft',
    slug: 'draft-role',
    status: 'draft',
    title: { vi: 'Draft Role', jp: 'ドラフト' },
    summary: { vi: 'Không public', jp: '非公開' },
    description: { vi: 'Không public', jp: '非公開' },
    requirements: { vi: [], jp: [] },
    benefits: { vi: [], jp: [] },
    location: 'Hà Nội',
    employmentType: 'Full Time',
    department: 'Draft',
    salaryRange: 'N/A',
    tags: [],
    publishedAgo: { vi: '', jp: '' },
    publishedAt: '',
    expiresAt: '',
    imageUrl: ''
  }
]

export function filterPublishedJobs({ locale, q }: { locale: Locale; q?: string }): PublicJob[] {
  const query = q?.trim().toLowerCase()
  return jobs.filter((job) => {
    if (job.status !== 'published') return false
    if (!query) return true
    const haystack = [job.title[locale], job.summary[locale], job.department, job.location, ...job.tags].join(' ').toLowerCase()
    return haystack.includes(query)
  })
}

export function getPublishedJobBySlug(slug: string): PublicJob | null {
  return jobs.find((job) => job.slug === slug && job.status === 'published') ?? null
}
