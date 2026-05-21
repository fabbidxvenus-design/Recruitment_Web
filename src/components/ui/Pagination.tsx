type PaginationProps = {
  currentPage: number
  totalPages: number
  getHref: (page: number) => string
}

export function Pagination({ currentPage, getHref, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav aria-label="Pagination">
      {pages.map((page) => (
        <a aria-current={page === currentPage ? 'page' : undefined} href={getHref(page)} key={page}>
          {page}
        </a>
      ))}
    </nav>
  )
}
