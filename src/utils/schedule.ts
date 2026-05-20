import type { StopId, Trip, Weekday } from '../types/schedule'
import { STOPS } from '../data/pushkino'

export function getStopName(id: StopId): string {
  return STOPS.find((s) => s.id === id)?.name ?? id
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function formatDuration(departAt: string, arriveAt: string): string {
  let diff = timeToMinutes(arriveAt) - timeToMinutes(departAt)
  if (diff < 0) diff += 24 * 60
  const h = Math.floor(diff / 60)
  const m = diff % 60
  if (h === 0) return `${m} мин`
  if (m === 0) return `${h} ч`
  return `${h} ч ${m} мин`
}

export function getWeekday(dateIso: string): Weekday {
  const [y, m, d] = dateIso.split('-').map(Number)
  return new Date(y, m - 1, d).getDay() as Weekday
}

export function isTripOnDate(trip: Trip, dateIso: string): boolean {
  return trip.days.includes(getWeekday(dateIso))
}

export interface SearchParams {
  from: StopId
  to: StopId
  dateIso: string
  /** If true, hide departures before current local time when date is today */
  onlyUpcoming: boolean
}

export function findTrips(trips: Trip[], params: SearchParams): Trip[] {
  const { from, to, dateIso, onlyUpcoming } = params
  if (from === to) return []

  let result = trips.filter(
    (t) => t.from === from && t.to === to && isTripOnDate(t, dateIso),
  )

  if (onlyUpcoming && dateIso === todayIso()) {
    const now = new Date()
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    result = result.filter((t) => timeToMinutes(t.departAt) >= nowMinutes)
  }

  return result.sort(
    (a, b) => timeToMinutes(a.departAt) - timeToMinutes(b.departAt),
  )
}

export function todayIso(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
