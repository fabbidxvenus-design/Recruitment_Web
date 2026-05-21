import Image from 'next/image'
import type { PublicNews } from '@/lib/content/news'
import type { Locale } from '@/lib/i18n/locales'

export function NewsDetailPageContent({ item, locale }: { item: PublicNews; locale: Locale }) {
  return (
    <article className="article-shell design-article-shell">
      <nav className="article-breadcrumb" aria-label="Breadcrumb">
        <span>{locale === 'vi' ? 'Tin tức' : 'ニュース'}</span><span>›</span><strong>{item.category[locale]}</strong>
      </nav>
      <h1>{item.title[locale]}</h1>
      <div className="article-author">
        <span className="author-avatar">A</span>
        <span>Admin</span>
        <span>•</span>
        <span>{item.publishedAt}</span>
        <span>•</span>
        <span>{item.readTime[locale]}</span>
      </div>
      <div className="article-image article-hero-image">
        <Image alt={item.title[locale]} height={520} src={item.imageUrl} width={1200} />
      </div>
      <div className="article-body">
        <h2>{locale === 'vi' ? 'Giới thiệu' : 'Introduction'}</h2>
        {item.body[locale].map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <blockquote>{locale === 'vi' ? 'Fabbi tin rằng văn hóa mạnh tạo nên sản phẩm mạnh.' : '強い文化が強いプロダクトを生み出します。'}</blockquote>
        <figure className="inline-article-figure">
          <div className="article-image"><Image alt={locale === 'vi' ? 'Hoạt động nội bộ Fabbi' : 'Fabbi社内活動'} height={360} src={item.imageUrl} width={860} /></div>
          <figcaption>{locale === 'vi' ? 'Khoảnh khắc kết nối trong một hoạt động nội bộ tại Fabbi.' : 'Fabbiの社内活動でのつながりの瞬間。'}</figcaption>
        </figure>
        <h2>{locale === 'vi' ? 'Kết luận' : 'Conclusion'}</h2>
        <p>{locale === 'vi' ? 'Hành trình phát triển tại Fabbi luôn gắn với học hỏi, chia sẻ và tinh thần đồng đội.' : 'Fabbiでの成長は、学び、共有、チームワークと共にあります。'}</p>
        <p className="view-count">11 {locale === 'vi' ? 'Lượt xem' : '回閲覧'}</p>
      </div>
    </article>
  )
}
