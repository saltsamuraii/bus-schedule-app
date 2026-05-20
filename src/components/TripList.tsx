import type { Trip } from '../types/schedule'
import { TripCard } from './TripCard'
import { getStopName, todayIso } from '../utils/schedule'
import type { StopId } from '../types/schedule'

interface TripListProps {
  trips: Trip[]
  from: StopId
  to: StopId
  dateIso: string
  searched: boolean
}

function formatDisplayDate(dateIso: string): string {
  const [y, m, d] = dateIso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function TripList({ trips, from, to, dateIso, searched }: TripListProps) {
  if (!searched) {
    return (
      <p className="hint">
        Выберите остановки и нажмите «Найти рейсы», чтобы увидеть расписание.
      </p>
    )
  }

  if (from === to) {
    return (
      <p className="message message--warn" role="alert">
        Остановки отправления и назначения должны отличаться.
      </p>
    )
  }

  const routeLabel = `${getStopName(from)} → ${getStopName(to)}`
  const isToday = dateIso === todayIso()

  if (trips.length === 0) {
    return (
      <div className="results">
        <h2 className="results__title">{routeLabel}</h2>
        <p className="results__meta">{formatDisplayDate(dateIso)}</p>
        <p className="message message--empty" role="alert">
          {isToday
            ? 'На сегодня ближайших рейсов по этому направлению нет. Попробуйте другую дату.'
            : 'Рейсов на выбранную дату нет. Попробуйте другой день или направление.'}
        </p>
      </div>
    )
  }

  return (
    <div className="results">
      <h2 className="results__title">{routeLabel}</h2>
      <p className="results__meta">
        {formatDisplayDate(dateIso)}
        {isToday ? ' · показаны ближайшие рейсы' : ''}
      </p>
      <ul className="trip-list">
        {trips.map((trip) => (
          <li key={trip.id}>
            <TripCard trip={trip} />
          </li>
        ))}
      </ul>
    </div>
  )
}
