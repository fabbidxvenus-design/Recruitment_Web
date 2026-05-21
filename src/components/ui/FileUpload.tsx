import { useId, type InputHTMLAttributes } from 'react'

type FileUploadProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
  name: string
  error?: string
  helperText?: string
}

export function FileUpload({ error, helperText, id, label, name, ...props }: FileUploadProps) {
  const generatedId = useId()
  const inputId = id ?? `${name}-${generatedId}`
  const errorId = `${inputId}-error`
  const helperId = `${inputId}-helper`
  const describedBy = [helperText ? helperId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined

  return (
    <label className="ui-field ui-file-upload" htmlFor={inputId}>
      <span className="ui-label">{label}</span>
      {helperText ? <span id={helperId}>{helperText}</span> : null}
      <input
        aria-describedby={describedBy}
        aria-invalid={error ? 'true' : undefined}
        id={inputId}
        name={name}
        type="file"
        {...props}
      />
      {error ? <span className="ui-error" id={errorId}>{error}</span> : null}
    </label>
  )
}
