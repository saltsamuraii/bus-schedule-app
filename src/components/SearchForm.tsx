import { useEffect, useState, type FormEvent } from 'react'
import { DatePicker } from './DatePicker'
import { STOPS } from '../data/pushkino'
import { isStopId, sanitizeIsoDate } from '../utils/security'
import type { SearchFormValues } from '../types/search'
import type { StopId } from '../types/schedule'

interface SearchFormProps {
  initial: SearchFormValues
  onSearch: (values: SearchFormValues) => void
}

function readStopFromSelect(value: string): StopId | null {
  return isStopId(value) ? value : null
}

const DATE_MIN = '2024-01-01'
const DATE_MAX = '2030-12-31'

export function SearchForm({ initial, onSearch }: SearchFormProps) {
  const [dateIso, setDateIso] = useState(initial.dateIso)

  useEffect(() => {
    setDateIso(initial.dateIso)
  }, [initial.dateIso])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const from = readStopFromSelect(String(form.get('from') ?? ''))
    const to = readStopFromSelect(String(form.get('to') ?? ''))
    const safeDate = sanitizeIsoDate(dateIso)

    if (!from || !to || !safeDate) return
    onSearch({ from, to, dateIso: safeDate })
  }

  const swapStops = () => {
    onSearch({ from: initial.to, to: initial.from, dateIso: initial.dateIso })
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-form__row">
        <label className="field">
          <span className="field__label">Откуда</span>
          <select
            name="from"
            className="field__control"
            defaultValue={initial.from}
            required
          >
            {STOPS.map((stop) => (
              <option key={stop.id} value={stop.id}>
                {stop.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className="swap-btn"
          onClick={swapStops}
          aria-label="Поменять остановки местами"
          title="Поменять местами"
        >
          ⇄
        </button>

        <label className="field">
          <span className="field__label">Куда</span>
          <select
            name="to"
            className="field__control"
            defaultValue={initial.to}
            required
          >
            {STOPS.map((stop) => (
              <option key={stop.id} value={stop.id}>
                {stop.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="field field--date">
        <span className="field__label">Дата</span>
        <DatePicker
          name="date"
          value={dateIso}
          onChange={setDateIso}
          min={DATE_MIN}
          max={DATE_MAX}
        />
      </div>

      <button type="submit" className="primary-btn">
        Найти рейсы
      </button>
    </form>
  )
}
