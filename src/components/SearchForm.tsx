import { useEffect, useState, type FormEvent } from 'react'
import { DatePicker } from './DatePicker'
import { StopCombobox } from './StopCombobox'
import { isStopId, sanitizeIsoDate } from '../utils/security'
import type { SearchFormValues } from '../types/search'
import type { StopId } from '../types/schedule'

interface SearchFormProps {
  initial: SearchFormValues
  onSearch: (values: SearchFormValues) => void
}

const DATE_MIN = '2024-01-01'
const DATE_MAX = '2030-12-31'

export function SearchForm({ initial, onSearch }: SearchFormProps) {
  const [from, setFrom] = useState<StopId>(initial.from)
  const [to, setTo] = useState<StopId>(initial.to)
  const [dateIso, setDateIso] = useState(initial.dateIso)

  useEffect(() => {
    setFrom(initial.from)
    setTo(initial.to)
    setDateIso(initial.dateIso)
  }, [initial.from, initial.to, initial.dateIso])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const safeDate = sanitizeIsoDate(dateIso)
    if (!isStopId(from) || !isStopId(to) || !safeDate) return
    if (from === to) return
    onSearch({ from, to, dateIso: safeDate })
  }

  const swapStops = () => {
    onSearch({ from: initial.to, to: initial.from, dateIso: initial.dateIso })
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-form__row">
        <StopCombobox label="Откуда" value={from} onChange={setFrom} required />

        <button
          type="button"
          className="swap-btn"
          onClick={swapStops}
          aria-label="Поменять остановки местами"
          title="Поменять местами"
        >
          ⇄
        </button>

        <StopCombobox label="Куда" value={to} onChange={setTo} required />
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
