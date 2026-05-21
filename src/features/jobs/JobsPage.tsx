import Link from 'next/link'
import { filterPublishedJobs } from '@/lib/content/jobs'
import type { Locale } from '@/lib/i18n/locales'

function employmentBadgeClass(type: string): string {
  return type.toLowerCase().includes('full') ? 'badge-blue' : 'badge-green'
}

export function JobsPageContent({ locale, query }: { locale: Locale; query?: string }) {
  const jobs = filterPublishedJobs({ locale, q: query })
  const jobCountLabel = locale === 'vi' ? `${jobs.length} Jobs` : `${jobs.length}件`

  return (
    <>
      <section className="public-container public-section">
        <div className="hero-panel jobs-hero">
          <span className="hero-illustration left">💼</span>
          <span className="hero-illustration right">👩‍💻</span>
          <h1><span className="teal-text">{jobCountLabel}</span> {locale === 'vi' ? 'đang open' : '募集中'}</h1>
          <p>{locale === 'vi' ? 'Tìm vị trí phù hợp với kỹ năng, địa điểm và định hướng phát triển của bạn.' : 'スキル、勤務地、成長目標に合うポジションを探せます。'}</p>
          <form className="search-pill">
            <select aria-label={locale === 'vi' ? 'Địa điểm' : '勤務地'} name="location" defaultValue="HN">
              <option value="HN">Hà Nội</option>
              <option value="DN">Đà Nẵng</option>
              <option value="JP">Japan</option>
            </select>
            <input aria-label={locale === 'vi' ? 'Từ khóa' : 'キーワード'} defaultValue={query} name="q" placeholder={locale === 'vi' ? 'Nhập tên công việc tìm kiếm ...' : '求人名を入力 ...'} />
            <button type="submit">{locale === 'vi' ? 'Tìm kiếm' : '検索'}</button>
          </form>
        </div>
      </section>
      <section className="public-container public-section content-grid">
        <aside className="jobs-sidebar">
          <section className="facebook-widget">
            <div className="facebook-cover">Fabbi Careers</div>
            <button type="button">f Like Page</button>
          </section>
          <section className="sidebar-card social-feed">
            <h2>{locale === 'vi' ? 'Tin từ Fabbi' : 'Fabbi投稿'}</h2>
            {['Career day', 'Training', 'Team trip'].map((item) => <p key={item}>▣ {item}</p>)}
          </section>
        </aside>
        <div>
          <h2>{locale === 'vi' ? 'Danh sách tuyển dụng' : '求人一覧'}</h2>
          <div className="job-list">
            {jobs.length ? jobs.map((job, index) => (
              <article className="job-card designed-job-card horizontal-job-card" key={job.slug}>
                <div className="card-topline">
                  <span className="company-mark">F</span>
                  <span>Fabbi {index % 2 === 0 ? 'JSC' : 'Japan'}</span>
                  <span className="bookmark">☆</span>
                </div>
                <div>
                  <h3>{job.title[locale]}</h3>
                  <p>{job.summary[locale]}</p>
                  <div className="metadata-row"><span>🕒 {job.publishedAgo[locale]}</span><span>⏳ {job.expiresAt}</span><span>💰 {job.salaryRange}</span></div>
                  <p>📍 {job.location}</p>
                  <div className="tag-row">
                    <span className={`tag ${employmentBadgeClass(job.employmentType)}`}>{job.employmentType}</span>
                    <span className="tag">{job.department}</span>
                    {job.tags.map((tag) => <span className="tag tag-link" key={tag}>#{tag}</span>)}
                  </div>
                </div>
                <Link className="public-cta" href={`/${locale}/jobs/${job.slug}`}>{locale === 'vi' ? 'Xem chi tiết' : '詳細を見る'}</Link>
              </article>
            )) : <section className="ui-empty-state" role="status"><h2>{locale === 'vi' ? 'Không tìm thấy việc làm' : '求人が見つかりません'}</h2></section>}
          </div>
          <nav className="pagination-strip" aria-label="Pagination">
            {['Prev', '1', '2', '3', '...', '10', 'Next'].map((item) => <Link href={`/${locale}/jobs`} key={item}>{item}</Link>)}
          </nav>
        </div>
      </section>
      <section className="public-container public-section photo-carousel-section">
        <div className="section-heading-row"><h2>{locale === 'vi' ? 'Chuyên mục ảnh' : 'フォトギャラリー'}</h2><Link href={`/${locale}/news`}>{locale === 'vi' ? 'Xem thêm' : 'もっと見る'} →</Link></div>
        <div className="photo-strip">{['Team', 'Office', 'Event'].map((item) => <div className="photo-tile" key={item}>{item}</div>)}</div>
      </section>
      <section className="public-container public-section">
        <div className="section-heading"><h2>{locale === 'vi' ? 'Tìm kiếm công việc theo Location' : '勤務地から探す'}</h2></div>
        <div className="location-grid">
          {['Hà Nội', 'Đà Nẵng', 'Japan'].map((location) => <Link className="location-card" href={`/${locale}/jobs?location=${encodeURIComponent(location)}`} key={location}>{location}<span>→</span></Link>)}
        </div>
      </section>
      <div className="floating-bell" aria-hidden="true">🔔</div>
    </>
  )
}
