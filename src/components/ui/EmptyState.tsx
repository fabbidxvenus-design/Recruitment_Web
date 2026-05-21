type EmptyStateProps = {
  title: string
  description?: string
}

export function EmptyState({ description, title }: EmptyStateProps) {
  return (
    <section className="ui-empty-state" role="status">
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </section>
  )
}
