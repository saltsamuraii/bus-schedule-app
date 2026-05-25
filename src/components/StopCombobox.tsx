import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { getStopName } from '../utils/schedule'
import { filterStops, resolveStopId } from '../utils/stopSearch'
import { sanitizeStopQuery } from '../utils/security'
import type { StopId } from '../types/schedule'

interface StopComboboxProps {
  label: string
  value: StopId
  onChange: (id: StopId) => void
  required?: boolean
}

export function StopCombobox({
  label,
  value,
  onChange,
  required,
}: StopComboboxProps) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState(() => getStopName(value))
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const options = filterStops(query)

  useEffect(() => {
    setQuery(getStopName(value))
  }, [value])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const commitStop = (id: StopId) => {
    onChange(id)
    setQuery(getStopName(id))
    setOpen(false)
  }

  const tryCommitQuery = (): boolean => {
    const id = resolveStopId(query)
    if (!id) return false
    commitStop(id)
    return true
  }

  const handleBlur = () => {
    window.setTimeout(() => {
      if (rootRef.current?.contains(document.activeElement)) return
      if (!tryCommitQuery()) setQuery(getStopName(value))
      setOpen(false)
    }, 0)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActiveIndex((i) => Math.min(i + 1, Math.max(0, options.length - 1)))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setOpen(true)
      setActiveIndex((i) => Math.max(i - 1, 0))
      return
    }
    if (e.key === 'Enter' && open && options.length > 0) {
      e.preventDefault()
      commitStop(options[activeIndex].id)
      return
    }
    if (e.key === 'Escape') {
      setQuery(getStopName(value))
      setOpen(false)
    }
  }

  return (
    <div className="stop-combobox field" ref={rootRef}>
      <label className="field__label" htmlFor={listId}>
        {label}
      </label>
      <input
        id={listId}
        type="text"
        className="field__control"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={`${listId}-listbox`}
        autoComplete="off"
        spellCheck={false}
        required={required}
        value={query}
        onChange={(e) => {
          setQuery(sanitizeStopQuery(e.target.value))
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      {open && options.length > 0 && (
        <ul
          id={`${listId}-listbox`}
          className="stop-combobox__list"
          role="listbox"
        >
          {options.map((stop, index) => (
            <li key={stop.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={
                  index === activeIndex
                    ? 'stop-combobox__option stop-combobox__option--active'
                    : 'stop-combobox__option'
                }
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => commitStop(stop.id)}
              >
                {stop.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
