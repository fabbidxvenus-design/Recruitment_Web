import type { HTMLAttributes, ReactNode } from 'react'

type StatusTone = 'published' | 'draft' | 'archived' | 'success' | 'warning' | 'error'

type StatusChipProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode
  status: StatusTone
}

export function StatusChip({ children, className, status, ...props }: StatusChipProps) {
  const classes = ['ui-status-chip', `ui-status-chip--${status}`, className].filter(Boolean).join(' ')

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  )
}
