import type { Trip } from '../types/schedule'
import { formatDuration, getStopName } from '../utils/schedule'

interface TripCardProps {
  trip: Trip
}

export function TripCard({ trip }: TripCardProps) {
  return (
    <article className="trip-card">
      <header className="trip-card__header">
        <span className="trip-card__route">Автобус №{trip.routeNumber}</span>
        <span className="trip-card__duration">
          {formatDuration(trip.departAt, trip.arriveAt)} в пути
        </span>
      </header>
      <div className="trip-card__times">
        <div className="trip-card__time-block">
          <time dateTime={trip.departAt} className="trip-card__time">
            {trip.departAt}
          </time>
          <span className="trip-card__stop">{getStopName(trip.from)}</span>
        </div>
        <span className="trip-card__arrow" aria-hidden="true">
          →
        </span>
        <div className="trip-card__time-block">
          <time dateTime={trip.arriveAt} className="trip-card__time">
            {trip.arriveAt}
          </time>
          <span className="trip-card__stop">{getStopName(trip.to)}</span>
        </div>
      </div>
    </article>
  )
}
