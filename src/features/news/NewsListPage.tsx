import Image from 'next/image'
import Link from 'next/link'
import { listPublishedNews } from '@/lib/content/news'
import type { Locale } from '@/lib/i18n/locales'

export function NewsListPageContent({ locale }: { locale: Locale }) {
  const [featured, ...items] = listPublishedNews(locale)
  const attentionItems = [featured, ...items, featured, ...items].filter(Boolean).slice(0, 4)

  return (
    <>
      <section className="public-container public-section content-grid news-layout">
        <aside className="sidebar-card news-sidebar">
          <h2>{locale === 'vi' ? 'Tin tức Fabbi' : 'Fabbiニュース'}</h2>
          {(locale === 'vi' ? ['Người Fabbi', 'Các hoạt động', 'Giải thưởng'] : ['Fabbiの人々', '活動', '受賞']).map((category) => <p key={category}>› {category}</p>)}
        </aside>
        <div>
          <p className="public-eyebrow">{locale === 'vi' ? 'Tin tức' : 'ニュース'}</p>
          <h1>{locale === 'vi' ? 'Tin tức mới nhất về Fabbi' : 'Fabbiの最新ニュース'}</h1>
          <form className="search-pill news-search">
            <input aria-label={locale === 'vi' ? 'Tìm bài viết' : '記事検索'} placeholder={locale === 'vi' ? 'Tìm bài viết' : '記事を検索'} />
            <button type="submit">{locale === 'vi' ? 'Tìm kiếm' : '検索'}</button>
          </form>
          {featured ? (
            <section className="featured-news news-card image-news-card" aria-labelledby="featured-news-heading">
              <div className="article-image featured-image"><Image alt={featured.title[locale]} height={540} src={featured.imageUrl} width={960} /></div>
              <div className="card-topline"><p className="tag">{featured.category[locale]}</p><span>5 min ago</span></div>
              <h2 id="featured-news-heading">{featured.title[locale]}</h2>
              <p>{featured.excerpt[locale]}</p>
              <Link href={`/${locale}/news/${featured.slug}`}>{locale === 'vi' ? 'Đọc thêm' : '続きを読む'} →</Link>
            </section>
          ) : <div className="ui-empty-state" role="status"><p>{locale === 'vi' ? 'Chưa có tin tức' : 'ニュースはありません'}</p></div>}
          <div className="card-grid">
            {items.map((item) => (
              <article className="news-card image-news-card" key={item.slug}>
                <div className="article-image"><Image alt={item.title[locale]} height={360} src={item.imageUrl} width={576} /></div>
                <p className="tag">{item.category[locale]}</p>
                <h3>{item.title[locale]}</h3>
                <p>{item.excerpt[locale]}</p>
                <Link href={`/${locale}/news/${item.slug}`}>{locale === 'vi' ? 'Đọc thêm' : '続きを読む'} →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="public-container public-section attention-news-section">
        <div className="section-heading-row"><h2>{locale === 'vi' ? 'Tin tức chú ý' : '注目ニュース'}</h2><Link href={`/${locale}/news`}>{locale === 'vi' ? 'Xem tất cả' : 'すべて見る'} →</Link></div>
        <div className="attention-list">
          {attentionItems.map((item, index) => item ? (
            <article className="attention-card" key={`${item.slug}-${index}`}>
              <div className="attention-thumb"><Image alt={item.title[locale]} height={120} src={item.imageUrl} width={180} /></div>
              <div><span className="tag">{item.category[locale]}</span><h3>{item.title[locale]}</h3><p>{item.excerpt[locale]}</p><Link href={`/${locale}/news/${item.slug}`}>{locale === 'vi' ? 'Đọc tiếp' : '続きを読む'} →</Link></div>
            </article>
          ) : null)}
        </div>
      </section>
    </>
  )
}
