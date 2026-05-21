import type { HTMLAttributes, ReactNode } from 'react'

type AlertVariant = 'info' | 'error'

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  variant?: AlertVariant
}

export function Alert({ children, className, variant = 'info', ...props }: AlertProps) {
  const classes = ['ui-alert', `ui-alert--${variant}`, className].filter(Boolean).join(' ')

  return (
    <div className={classes} role={variant === 'error' ? 'alert' : 'status'} {...props}>
      {children}
    </div>
  )
}
