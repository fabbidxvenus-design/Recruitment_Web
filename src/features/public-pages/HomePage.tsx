import Image from 'next/image'
import Link from 'next/link'
import { filterPublishedJobs } from '@/lib/content/jobs'
import { listPublishedNews } from '@/lib/content/news'
import { publicCopy } from '@/lib/content/site'
import type { Locale } from '@/lib/i18n/locales'

const services = {
  vi: ['Tuyển dụng nhân sự IT', 'Phát triển phần mềm', 'Tư vấn giải pháp'],
  jp: ['IT人材採用', 'ソフトウェア開発', 'ソリューション相談']
}

export function HomePageContent({ locale }: { locale: Locale }) {
  const copy = publicCopy[locale].home
  const jobs = filterPublishedJobs({ locale }).slice(0, 2)
  const news = listPublishedNews(locale).slice(0, 3)

  return (
    <>
      <section className="public-container public-section">
        <div className="hero-panel home-hero-panel">
          <p className="public-eyebrow">Fabbi Careers</p>
          <h1>{copy.heroTitle}</h1>
          <p>{copy.heroBody}</p>
          <div className="hero-actions">
            <Link className="public-cta" href={`/${locale}/jobs`}>
              {copy.cta}
            </Link>
            <Link className="secondary-cta" href={`/${locale}/about`}>
              {locale === 'vi' ? 'Liên hệ ngay' : 'お問い合わせ'}
            </Link>
          </div>
        </div>
      </section>

      <section className="public-container">
        <div className="stats-band">
          {copy.stats.map((stat) => {
            const [value, ...labelParts] = stat.split(' ')
            return (
              <div key={stat}>
                <div className="stat-value">{value}</div>
                <p>{labelParts.join(' ')}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="public-container public-section">
        <div className="section-heading">
          <p className="public-eyebrow">Services</p>
          <h2>{locale === 'vi' ? 'Dịch vụ nổi bật tại Fabbi' : 'Fabbiの主なサービス'}</h2>
        </div>
        <div className="service-grid">
          {services[locale].map((service, index) => (
            <article className="service-card" key={service}>
              <span className="service-icon">{['◎', '▣', '◇'][index]}</span>
              <h3>{service}</h3>
              <p>{locale === 'vi' ? 'Đồng hành cùng khách hàng Nhật Bản với đội ngũ giàu kinh nghiệm và tiêu chuẩn vận hành rõ ràng.' : '経験豊富なチームと明確な運用品質で日本のお客様を支援します。'}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="public-container public-section split-section">
        <div>
          <p className="public-eyebrow">Employer Brand</p>
          <h2>{locale === 'vi' ? 'Môi trường phát triển cho kỹ sư công nghệ' : 'エンジニアが成長できる環境'}</h2>
          <p>{locale === 'vi' ? 'Fabbi kết hợp văn hóa học hỏi, tiêu chuẩn Nhật Bản và tinh thần sản phẩm để tạo nên nơi làm việc bền vững.' : 'Fabbiは学びの文化、日本品質、プロダクト志向を組み合わせた職場です。'}</p>
        </div>
        <div className="media-card team-media" aria-label="Fabbi team culture" />
      </section>

      <section className="public-container public-section">
        <div className="section-heading-row">
          <div>
            <p className="public-eyebrow">Jobs</p>
            <h2>{locale === 'vi' ? 'Việc làm nổi bật' : '注目求人'}</h2>
          </div>
          <Link href={`/${locale}/jobs`}>{locale === 'vi' ? 'Xem tất cả' : 'すべて見る'} →</Link>
        </div>
        <div className="card-grid">
          {jobs.map((job, index) => (
            <article className="job-card designed-job-card" key={job.slug}>
              <div className="card-topline">
                <span className="company-mark">F</span>
                <span>Fabbi {index % 2 === 0 ? 'JSC' : 'Japan'}</span>
                {index === 1 ? <span className="hot-badge">Hot</span> : null}
                <span className="bookmark">☆</span>
              </div>
              <h3>{job.title[locale]}</h3>
              <p>{job.summary[locale]}</p>
              <div className="metadata-row"><span>{job.publishedAgo[locale]}</span><span>{job.expiresAt}</span><span>{job.salaryRange}</span></div>
              <div className="tag-row">{job.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
              <Link className="public-cta" href={`/${locale}/jobs/${job.slug}`}>{locale === 'vi' ? 'Xem chi tiết' : '詳細を見る'}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="public-container public-section">
        <div className="section-heading-row">
          <div>
            <p className="public-eyebrow">News</p>
            <h2>{locale === 'vi' ? 'Tin tức mới nhất' : '最新ニュース'}</h2>
          </div>
          <Link href={`/${locale}/news`}>{locale === 'vi' ? 'Xem tất cả' : 'すべて見る'} →</Link>
        </div>
        <div className="card-grid">
          {news.map((item) => (
            <article className="news-card image-news-card" key={item.slug}>
              <div className="article-image"><Image alt={item.title[locale]} height={320} src={item.imageUrl} width={520} /></div>
              <p className="tag">{item.category[locale]}</p>
              <h3>{item.title[locale]}</h3>
              <p>{item.excerpt[locale]}</p>
              <Link href={`/${locale}/news/${item.slug}`}>{locale === 'vi' ? 'Đọc tiếp' : '続きを読む'} →</Link>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
