import { useId, type InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
  error?: string
}

export function Input({ error, id, label, name, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? `${name}-${generatedId}`
  const errorId = `${inputId}-error`

  return (
    <label className="ui-field" htmlFor={inputId}>
      <span className="ui-label">{label}</span>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-label={label}
        className="ui-input"
        id={inputId}
        name={name}
        {...props}
      />
      {error ? (
        <span className="ui-error" id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  )
}
