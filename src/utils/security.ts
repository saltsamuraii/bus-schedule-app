import type { StopId } from '../types/schedule'
import { STOP_IDS } from '../data/pushkino'

const STOP_ID_SET = new Set<string>(STOP_IDS)

/**
 * Sanitize free-text typed in the station search field.
 * This string is only used for filtering UI; stop ids still go through allowlist.
 */
export function sanitizeStopQuery(raw: unknown): string {
  if (typeof raw !== 'string') return ''
  let out = ''
  for (const ch of raw) {
    const code = ch.charCodeAt(0)
    if (code >= 0x20 && code !== 0x7f) out += ch
  }
  return out.trim().slice(0, 80)
}

/** Allowlist: only known stop ids from static data. */
export function isStopId(value: unknown): value is StopId {
  return typeof value === 'string' && STOP_ID_SET.has(value)
}

/**
 * Normalize untrusted input (e.g. query string) to a safe stop id or null.
 * Strips control chars and limits length before allowlist check.
 */
export function sanitizeStopId(raw: unknown): StopId | null {
  if (typeof raw !== 'string') return null
  const trimmed = raw.trim().slice(0, 64)
  if (!/^[a-z]+$/.test(trimmed)) return null
  return isStopId(trimmed) ? trimmed : null
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/** Validate date from <input type="date">; rejects invalid calendar dates. */
export function sanitizeIsoDate(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const trimmed = raw.trim().slice(0, 10)
  if (!ISO_DATE_RE.test(trimmed)) return null
  const [y, m, d] = trimmed.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null
  }
  return trimmed
}
