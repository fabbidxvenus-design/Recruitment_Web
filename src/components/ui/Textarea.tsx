import { useId, type TextareaHTMLAttributes } from 'react'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  name: string
  error?: string
}

export function Textarea({ error, id, label, name, ...props }: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? `${name}-${generatedId}`
  const errorId = `${textareaId}-error`

  return (
    <label className="ui-field" htmlFor={textareaId}>
      <span className="ui-label">{label}</span>
      <textarea
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? 'true' : undefined}
        className="ui-textarea"
        id={textareaId}
        name={name}
        {...props}
      />
      {error ? <span className="ui-error" id={errorId}>{error}</span> : null}
    </label>
  )
}
