import { STOPS } from '../data/pushkino'
import type { Stop, StopId } from '../types/schedule'
import { sanitizeStopId, sanitizeStopQuery } from './security'

export function filterStops(query: string): Stop[] {
  const q = sanitizeStopQuery(query).toLocaleLowerCase('ru-RU')
  if (!q) return [...STOPS]
  return STOPS.filter((stop) =>
    stop.name.toLocaleLowerCase('ru-RU').includes(q),
  )
}

/** Map typed text to a known stop id, or null if ambiguous / unknown. */
export function resolveStopId(query: string): StopId | null {
  const q = sanitizeStopQuery(query)
  if (!q) return null

  const byId = sanitizeStopId(q)
  if (byId) return byId

  const lower = q.toLocaleLowerCase('ru-RU')
  const matches = STOPS.filter(
    (stop) => stop.name.toLocaleLowerCase('ru-RU') === lower,
  )
  if (matches.length === 1) return matches[0].id
  return null
}
