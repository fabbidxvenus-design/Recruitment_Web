import type { ReactNode } from 'react'

type ModalProps = {
  children: ReactNode
  isOpen: boolean
  title: string
  onClose: () => void
}

export function Modal({ children, isOpen, onClose, title }: ModalProps) {
  if (!isOpen) return null

  return (
    <div aria-modal="true" role="dialog" aria-label={title}>
      <div className="ui-card">
        <h2>{title}</h2>
        {children}
        <button className="ui-button ui-button--secondary" onClick={onClose} type="button">
          Close
        </button>
      </div>
    </div>
  )
}
