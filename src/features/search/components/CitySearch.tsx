import { useId, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { Place } from '@/core/types/place'
import { MIN_QUERY_LENGTH } from '../api/geocodingApi'
import { toSearchTerm, usePlaceSearch } from '../hooks/usePlaceSearch'
import styles from './CitySearch.module.css'

interface CitySearchProps {
  onSelect: (place: Place) => void
}

function describePlace(place: Place): string {
  return [place.region, place.country].filter(Boolean).join(', ')
}

export function CitySearch({ onSelect }: CitySearchProps) {
  const { t } = useTranslation('search')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const {
    data: places = [],
    isFetching,
    isError,
    isPlaceholderData,
    term,
    enabled,
    locale,
  } = usePlaceSearch(query)

  const inputId = useId()
  const listboxId = useId()
  const optionId = (index: number) => `${listboxId}-option-${index}`

  const typing = toSearchTerm(query, locale) !== term
  const searchable = query.trim().length >= MIN_QUERY_LENGTH
  const showList = open && searchable && enabled
  const loading = searchable && (typing || isFetching)
  // Suggestions still belong to the previous term while the debounce/request is pending.
  const stale = typing || isPlaceholderData

  function select(place: Place) {
    onSelect(place)
    setQuery('')
    setOpen(false)
    setActiveIndex(-1)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setOpen(true)
        setActiveIndex((index) => (places.length === 0 ? -1 : (index + 1) % places.length))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex((index) =>
          places.length === 0 ? -1 : (index - 1 + places.length) % places.length,
        )
        break
      case 'Enter': {
        // An explicitly highlighted option is always honoured; the implicit "first result"
        // shortcut only applies once the list matches what is in the field.
        const place = places[activeIndex] ?? (showList && !stale ? places[0] : undefined)
        if (place) {
          event.preventDefault()
          select(place)
        }
        break
      }
      case 'Escape':
        if (open) {
          event.preventDefault()
          setOpen(false)
          setActiveIndex(-1)
        } else {
          setQuery('')
        }
        break
    }
  }

  let status = ''
  if (showList) {
    if (isError) status = t('error')
    else if (loading && places.length === 0) status = t('searching')
    else if (!loading && places.length === 0) status = t('noResults')
    else if (!loading) status = t('count', { count: places.length })
  }

  return (
    <div className={styles.search} role="search">
      <label htmlFor={inputId} className="sr-only">
        {t('label')}
      </label>
      <div className={styles.field}>
        <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          id={inputId}
          className={styles.input}
          type="search"
          role="combobox"
          placeholder={t('placeholder')}
          autoComplete="off"
          spellCheck={false}
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={listboxId}
          aria-activedescendant={showList && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
        />
        {loading && <span className={styles.spinner} aria-hidden="true" />}
      </div>

      <ul
        id={listboxId}
        role="listbox"
        aria-label={t('results')}
        className={styles.listbox}
        data-stale={stale || undefined}
        hidden={!showList || places.length === 0}
      >
        {places.map((place, index) => (
          <li
            key={place.id}
            id={optionId(index)}
            role="option"
            aria-selected={index === activeIndex}
            className={styles.option}
            // Keeps focus in the input so `onBlur` does not close the list before the click.
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => select(place)}
            onMouseEnter={() => setActiveIndex(index)}
          >
            <span className={styles.optionName}>{place.name}</span>
            <span className={styles.optionMeta}>{describePlace(place)}</span>
          </li>
        ))}
      </ul>

      <p className={styles.status} role="status" aria-live="polite">
        {status && <span className={places.length > 0 ? 'sr-only' : undefined}>{status}</span>}
      </p>
    </div>
  )
}
