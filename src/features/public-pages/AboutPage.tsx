import { publicCopy } from '@/lib/content/site'
import type { Locale } from '@/lib/i18n/locales'

const activities = {
  vi: ['🏝️ Du lịch', '🌸 Women’s day', '🎩 Men’s day', '🎉 Year end party', '🩺 Khám sức khỏe', '📻 Radio nội bộ', '⚽ Thể thao', '💬 Góc Mise', '☕ Happy hour'],
  jp: ['🏝️ 旅行', '🌸 Women’s day', '🎩 Men’s day', '🎉 Year end party', '🩺 健康診断', '📻 社内ラジオ', '⚽ スポーツ', '💬 Miseコーナー', '☕ Happy hour']
}

const reasons = {
  vi: ['Thu nhập cạnh tranh', 'Môi trường làm việc', 'Công nghệ đa dạng', 'BLD quan tâm tới con người', 'Chú trọng Đào tạo'],
  jp: ['競争力のある収入', '働きやすい環境', '多様な技術', '人を大切にする経営陣', '教育重視']
}

export function AboutPageContent({ locale }: { locale: Locale }) {
  const copy = publicCopy[locale].about
  const stats = publicCopy[locale].home.stats

  return (
    <>
      <section className="about-hero" aria-label={copy.title}>
        <div className="about-hero-copy">
          <p className="public-eyebrow">About Fabbi</p>
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </div>
        <div className="about-play" aria-label={locale === 'vi' ? 'Phát video giới thiệu' : '紹介動画を再生'}>▶</div>
      </section>
      <section className="public-container stats-overlap">
        <div className="stats-band">
          {stats.map((stat) => {
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
      <section className="public-container public-section split-section">
        <div className="media-card team-media" />
        <div>
          <p className="public-eyebrow">Story</p>
          <h2>{locale === 'vi' ? 'Hành trình Fabbi' : 'Fabbiの歩み'}</h2>
          <p>{copy.story}</p>
        </div>
      </section>
      <section className="public-section about-activities">
        <div className="public-container">
          <div className="section-heading">
            <p className="public-eyebrow">Culture</p>
            <h2>{locale === 'vi' ? 'Các hoạt động nổi bật' : '主な活動'}</h2>
          </div>
          <div className="activity-layout">
            <aside className="sidebar-card activity-tabs" role="tablist" aria-label={locale === 'vi' ? 'Hoạt động Fabbi' : 'Fabbi activities'}>
              {activities[locale].map((activity, index) => (
                <button aria-selected={index === 0} className={index === 0 ? 'activity-tab active' : 'activity-tab'} key={activity} role="tab" tabIndex={index === 0 ? 0 : -1} type="button">{activity}</button>
              ))}
            </aside>
            <div className="activity-panel">
              <div className="media-card culture-media" />
              <div>
                <h3>{activities[locale][0]}</h3>
                <p>{locale === 'vi' ? 'Những chuyến đi, ngày hội và hoạt động nội bộ giúp người Fabbi kết nối, chia sẻ và tái tạo năng lượng.' : '旅行、イベント、社内活動を通してFabbiのメンバーがつながり、学び、リフレッシュします。'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="public-container public-section why-fabbi-section">
        <div className="section-heading">
          <p className="public-eyebrow">Why Fabbi</p>
          <h2>{locale === 'vi' ? 'Vì sao nên chọn Fabbi' : 'Fabbiを選ぶ理由'}</h2>
        </div>
        <div className="accordion-list">
          {reasons[locale].map((reason, index) => (
            <article className="accordion-item" key={reason}>
              <h3>{reason}</h3>
              <p>{locale === 'vi' ? 'Fabbi tạo môi trường rõ ràng, cởi mở và có nhiều cơ hội phát triển nghề nghiệp cho từng thành viên.' : 'Fabbiは明確でオープンな環境をつくり、一人ひとりのキャリア成長を支援します。'}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
