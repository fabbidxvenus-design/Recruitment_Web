import Image from 'next/image'
import Link from 'next/link'
import { filterPublishedJobs, type PublicJob } from '@/lib/content/jobs'
import type { Locale } from '@/lib/i18n/locales'

export function JobDetailPageContent({ job, locale }: { job: PublicJob; locale: Locale }) {
  const relatedJobs = filterPublishedJobs({ locale }).filter((item) => item.slug !== job.slug).slice(0, 4)

  return (
    <>
      <section className="public-container">
        <div className="job-banner"><Image alt="Business Plan Banner" height={400} src={job.imageUrl} width={1200} /></div>
        <div className="job-detail-header">
          <div>
            <h1>{job.title[locale]}</h1>
            <div className="metadata-row detail-meta"><span>🕒 {locale === 'vi' ? 'Ngày đăng:' : '投稿日:'} {job.publishedAgo[locale]}</span><span>⏳ {locale === 'vi' ? 'Ngày hết hạn ứng tuyển:' : '締切:'} {job.expiresAt}</span></div>
          </div>
          <Link className="public-cta" href={`/${locale}/apply?jobId=${job.id}`}>✓ {locale === 'vi' ? 'NỘP HỒ SƠ' : '応募する'}</Link>
        </div>
      </section>
      <section className="public-container public-section job-detail-grid">
        <article className="job-detail-body">
          <h2>{locale === 'vi' ? 'Mô tả công việc' : '仕事内容'}</h2>
          <p>{job.description[locale]}</p>
          <h2>{locale === 'vi' ? 'Yêu cầu công việc' : '応募条件'}</h2>
          <ul>{job.requirements[locale].map((item) => <li key={item}>{item}</li>)}</ul>
          <h2>{locale === 'vi' ? 'Quyền lợi' : '福利厚生'}</h2>
          <ul>{job.benefits[locale].map((item) => <li key={item}>{item}</li>)}</ul>
          <div className="job-action-bar">
            <button type="button">♡ {locale === 'vi' ? 'Lưu việc làm' : '保存'}</button>
            <button type="button">↗ {locale === 'vi' ? 'Chia sẻ' : '共有'}</button>
          </div>
        </article>
        <aside className="sidebar-card job-info-panel">
          <h2>{locale === 'vi' ? 'Thông tin' : '情報'}</h2>
          <p>⏳ {job.expiresAt}</p>
          <p>💰 {job.salaryRange}</p>
          <p>💼 {job.department}</p>
          <p>👥 02</p>
          <p>📍 {job.location}</p>
          <div className="mini-map">Map: {job.location}</div>
          <p>☎ +84 24 3200 8888</p>
          <p>✉ hr@fabbi.com.vn</p>
          <h3>{locale === 'vi' ? 'Hình thức làm việc' : '勤務形態'}</h3>
          <div className="tag-row"><span className="tag badge-blue">{job.employmentType}</span>{job.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
        </aside>
      </section>
      <section className="public-container public-section">
        <div className="section-heading-row"><h2>{locale === 'vi' ? 'Các Job đang tuyển khác' : '関連求人'}</h2><Link href={`/${locale}/jobs`}>{locale === 'vi' ? 'Xem tất cả' : 'すべて見る'} →</Link></div>
        <div className="card-grid">
          {relatedJobs.map((item) => (
            <article className="job-card designed-job-card" key={item.slug}>
              <div className="card-topline"><span className="company-mark">F</span><span>Fabbi JSC</span><span className="bookmark">☆</span></div>
              <h3>{item.title[locale]}</h3>
              <p>{item.summary[locale]}</p>
              <div className="metadata-row"><span>{item.publishedAgo[locale]}</span><span>{item.expiresAt}</span></div>
              <p>📍 {item.location}</p>
              <div className="tag-row">{item.tags.map((tag) => <span className="tag tag-link" key={tag}>#{tag}</span>)}</div>
              <Link className="public-cta" href={`/${locale}/jobs/${item.slug}`}>{locale === 'vi' ? 'Xem chi tiết' : '詳細を見る'}</Link>
            </article>
          ))}
        </div>
      </section>
      <div className="floating-bell" aria-hidden="true">💬</div>
    </>
  )
}
