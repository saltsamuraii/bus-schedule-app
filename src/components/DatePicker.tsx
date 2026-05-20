import { useEffect, useId, useRef, useState } from 'react'
import { sanitizeIsoDate } from '../utils/security'
import {
  addMonths,
  buildMonthGrid,
  formatDisplayDate,
  formatMonthTitle,
  parseIsoDate,
  WEEKDAY_LABELS,
  type CalendarDay,
} from '../utils/calendar'
import { todayIso } from '../utils/schedule'
import './DatePicker.css'

interface DatePickerProps {
  name?: string
  value: string
  onChange: (iso: string) => void
  min?: string
  max?: string
}

interface MonthPanelProps {
  year: number
  month: number
  selectedIso: string
  min?: string
  max?: string
  onSelect: (iso: string) => void
}

function MonthPanel({
  year,
  month,
  selectedIso,
  min,
  max,
  onSelect,
}: MonthPanelProps) {
  const today = todayIso()
  const days = buildMonthGrid(year, month, { minIso: min, maxIso: max, todayIso: today })

  return (
    <div className="date-picker__month">
      <p className="date-picker__month-title">
        {formatMonthTitle(year, month)}
      </p>
      <div className="date-picker__weekdays" aria-hidden="true">
        {WEEKDAY_LABELS.map((label, i) => (
          <span
            key={label}
            className={
              i >= 5 ? 'date-picker__weekday date-picker__weekday--weekend' : 'date-picker__weekday'
            }
          >
            {label}
          </span>
        ))}
      </div>
      <div className="date-picker__days" role="grid">
        {days.map((day) => (
          <DayCell
            key={`${year}-${month}-${day.iso}`}
            day={day}
            selected={day.iso === selectedIso}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}

function DayCell({
  day,
  selected,
  onSelect,
}: {
  day: CalendarDay
  selected: boolean
  onSelect: (iso: string) => void
}) {
  const classNames = [
    'date-picker__day',
    !day.inMonth && 'date-picker__day--outside',
    day.isWeekend && day.inMonth && 'date-picker__day--weekend',
    day.isPast && day.inMonth && 'date-picker__day--past',
    selected && 'date-picker__day--selected',
  ]
    .filter(Boolean)
    .join(' ')

  if (day.disabled) {
    return (
      <span className={classNames} aria-disabled="true">
        {day.day}
      </span>
    )
  }

  return (
    <button
      type="button"
      className={classNames}
      onClick={() => onSelect(day.iso)}
      aria-pressed={selected}
      aria-label={day.iso}
    >
      {day.day}
    </button>
  )
}

export function DatePicker({ name, value, onChange, min, max }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  const selected = parseIsoDate(value)
  const [viewYear, setViewYear] = useState(selected.getFullYear())
  const [viewMonth, setViewMonth] = useState(selected.getMonth())

  useEffect(() => {
    const d = parseIsoDate(value)
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
  }, [value])

  useEffect(() => {
    if (!open) return

    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const shiftView = (delta: number) => {
    const [y, m] = addMonths(viewYear, viewMonth, delta)
    setViewYear(y)
    setViewMonth(m)
  }

  const [nextYear, nextMonth] = addMonths(viewYear, viewMonth, 1)

  const handleSelect = (iso: string) => {
    const safe = sanitizeIsoDate(iso)
    if (!safe) return
    onChange(safe)
    setOpen(false)
  }

  return (
    <div className="date-picker" ref={rootRef}>
      <button
        type="button"
        className="date-picker__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={listId}
      >
        <span className="date-picker__trigger-icon" aria-hidden="true" />
        <span className="date-picker__trigger-text">{formatDisplayDate(value)}</span>
        <span className={`date-picker__chevron ${open ? 'date-picker__chevron--open' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <div
          id={listId}
          className="date-picker__popover"
          role="dialog"
          aria-label="Выбор даты"
        >
          <div className="date-picker__toolbar">
            <button
              type="button"
              className="date-picker__nav"
              onClick={() => shiftView(-1)}
              aria-label="Предыдущий месяц"
            >
              ‹
            </button>
            <button
              type="button"
              className="date-picker__nav"
              onClick={() => shiftView(1)}
              aria-label="Следующий месяц"
            >
              ›
            </button>
          </div>

          <div className="date-picker__months">
            <MonthPanel
              year={viewYear}
              month={viewMonth}
              selectedIso={value}
              min={min}
              max={max}
              onSelect={handleSelect}
            />
            <MonthPanel
              year={nextYear}
              month={nextMonth}
              selectedIso={value}
              min={min}
              max={max}
              onSelect={handleSelect}
            />
          </div>
        </div>
      )}

      {name ? <input type="hidden" name={name} value={value} /> : null}
    </div>
  )
}
