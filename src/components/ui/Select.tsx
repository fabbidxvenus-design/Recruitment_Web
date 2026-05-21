import { useId, type SelectHTMLAttributes } from 'react'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  name: string
  error?: string
  options: Array<{ label: string; value: string }>
}

export function Select({ error, id, label, name, options, ...props }: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? `${name}-${generatedId}`
  const errorId = `${selectId}-error`

  return (
    <label className="ui-field" htmlFor={selectId}>
      <span className="ui-label">{label}</span>
      <select
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? 'true' : undefined}
        className="ui-select"
        id={selectId}
        name={name}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="ui-error" id={errorId}>{error}</span> : null}
    </label>
  )
}
