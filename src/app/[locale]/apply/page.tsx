import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PublicShell } from '@/components/public/PublicShell'
import { filterPublishedJobs } from '@/lib/content/jobs'
import { parseLocale } from '@/lib/i18n/locales'
import { buildPageMetadata } from '@/lib/seo/metadata'

type PageProps = { params: Promise<{ locale: string }>; searchParams?: Promise<{ jobId?: string; status?: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = parseLocale(localeParam)
  return locale ? buildPageMetadata(locale, 'apply') : {}
}

export default async function ApplyPage({ params, searchParams }: PageProps) {
  const { locale: localeParam } = await params
  const resolvedSearchParams = await searchParams
  const locale = parseLocale(localeParam)
  if (!locale) notFound()

  const jobs = filterPublishedJobs({ locale })
  const selectedJob = jobs.find((job) => job.id === resolvedSearchParams?.jobId)

  return (
    <PublicShell locale={locale}>
      <section className="public-container public-section apply-hero-section">
        <div className="hero-panel apply-hero-panel">
          <p className="public-eyebrow">Apply</p>
          <h1>{locale === 'vi' ? 'Chọn vị trí ứng tuyển' : '応募ポジションを選択'}</h1>
          <p>{locale === 'vi' ? 'Chọn công việc phù hợp và gửi hồ sơ PDF để HR Fabbi liên hệ.' : '希望する求人を選択し、PDF履歴書を送信してください。'}</p>
        </div>
      </section>

      <section className="public-container public-section apply-layout">
        <aside className="position-list" aria-label={locale === 'vi' ? 'Vị trí đang tuyển' : '募集中の職種'}>
          {jobs.map((job) => (
            <Link className={job.id === selectedJob?.id ? 'position-card active' : 'position-card'} href={`/${locale}/apply?jobId=${job.id}`} key={job.id}>
              <strong>{job.title[locale]}</strong>
              <span>{job.location} • {job.employmentType}</span>
            </Link>
          ))}
        </aside>

        <form action="/api/applications" className="application-form" encType="multipart/form-data" method="post">
          {resolvedSearchParams?.status === 'success' ? <div className="form-success" role="status">{locale === 'vi' ? 'Ứng tuyển thành công. HR sẽ liên hệ với bạn.' : '応募が完了しました。HRから連絡します。'}</div> : null}
          <input name="locale" type="hidden" value={locale} />
          <label>
            {locale === 'vi' ? 'Vị trí ứng tuyển' : '応募職種'}
            <select name="targetPosition" required defaultValue={selectedJob?.title[locale] ?? ''}>
              <option value="">{locale === 'vi' ? 'Chọn vị trí' : '選択してください'}</option>
              {jobs.map((job) => <option key={job.id} value={job.title[locale]}>{job.title[locale]}</option>)}
            </select>
          </label>
          <label>{locale === 'vi' ? 'Họ và tên' : '氏名'}<input name="fullName" required /></label>
          <label>Email<input name="email" required type="email" /></label>
          <label>{locale === 'vi' ? 'Số điện thoại' : '電話番号'}<input name="phone" required /></label>
          <label>{locale === 'vi' ? 'Số năm kinh nghiệm' : '経験年数'}<input min="0" max="60" name="yearsOfExperience" required type="number" /></label>
          <label>Portfolio<input name="portfolioUrl" placeholder="https://" type="url" /></label>
          <label>{locale === 'vi' ? 'Thư giới thiệu' : 'カバーレター'}<textarea name="coverLetter" rows={5} /></label>
          <label>{locale === 'vi' ? 'CV PDF tối đa 5MB' : 'PDF履歴書（最大5MB）'}<input accept="application/pdf,.pdf" name="cv" required type="file" /></label>
          <p className="cv-policy">{locale === 'vi' ? 'CV được lưu trữ riêng tư và chỉ Admin/HR được truy cập.' : '履歴書は非公開で保存され、管理者/HRのみアクセスできます。'}</p>
          <button className="public-cta" type="submit">{locale === 'vi' ? 'Gửi hồ sơ' : '応募する'}</button>
        </form>
      </section>
    </PublicShell>
  )
}
