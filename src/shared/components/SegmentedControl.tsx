import styles from './SegmentedControl.module.css'

interface Option<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  /** Accessible group name. */
  label: string
  name: string
  value: T
  options: readonly Option<T>[]
  onChange: (value: T) => void
}

/** A radio group styled as a pill switch: native keyboard support (arrow keys) for free. */
export function SegmentedControl<T extends string>({
  label,
  name,
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={styles.group}>
      {options.map((option) => (
        <label key={option.value} className={styles.option}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
            className={styles.input}
          />
          <span className={styles.label}>{option.label}</span>
        </label>
      ))}
    </div>
  )
}
