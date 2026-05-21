type SkeletonProps = {
  label?: string
}

export function Skeleton({ label = 'Loading' }: SkeletonProps) {
  return <div aria-label={label} className="ui-skeleton" role="status" />
}
