import { Button } from './Button'
import { Modal } from './Modal'

type ConfirmDialogProps = {
  isOpen: boolean
  title: string
  message: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({ confirmLabel, isOpen, message, onCancel, onConfirm, title }: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <p>{message}</p>
      <Button onClick={onConfirm}>{confirmLabel}</Button>
    </Modal>
  )
}
