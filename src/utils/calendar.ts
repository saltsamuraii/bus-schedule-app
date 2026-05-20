const MONTH_NAMES = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
] as const

export const WEEKDAY_LABELS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'] as const

export interface CalendarDay {
  iso: string
  day: number
  inMonth: boolean
  isWeekend: boolean
  isPast: boolean
  disabled: boolean
}

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatMonthTitle(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`
}

export function formatDisplayDate(iso: string): string {
  const date = parseIsoDate(iso)
  const weekday = date.toLocaleDateString('ru-RU', { weekday: 'short' })
  const rest = date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return `${weekday}, ${rest}`
}

export function addMonths(year: number, month: number, delta: number): [number, number] {
  const d = new Date(year, month + delta, 1)
  return [d.getFullYear(), d.getMonth()]
}

export function buildMonthGrid(
  year: number,
  month: number,
  options: { minIso?: string; maxIso?: string; todayIso: string },
): CalendarDay[] {
  const { minIso, maxIso, todayIso } = options
  const first = new Date(year, month, 1)
  const startOffset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: CalendarDay[] = []

  for (let i = 0; i < startOffset; i++) {
    const d = new Date(year, month, -startOffset + i + 1)
    cells.push(dayMeta(d, false, minIso, maxIso, todayIso))
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(dayMeta(new Date(year, month, day), true, minIso, maxIso, todayIso))
  }

  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1]
    const d = parseIsoDate(last.iso)
    d.setDate(d.getDate() + 1)
    cells.push(dayMeta(d, false, minIso, maxIso, todayIso))
  }

  return cells
}

function dayMeta(
  date: Date,
  inMonth: boolean,
  minIso?: string,
  maxIso?: string,
  todayIso?: string,
): CalendarDay {
  const iso = toIsoDate(date)
  const dow = date.getDay()
  const isWeekend = dow === 0 || dow === 6
  const isPast = todayIso ? iso < todayIso : false
  const belowMin = minIso ? iso < minIso : false
  const aboveMax = maxIso ? iso > maxIso : false
  const disabled = !inMonth || isPast || belowMin || aboveMax

  return {
    iso,
    day: date.getDate(),
    inMonth,
    isWeekend,
    isPast,
    disabled,
  }
}

export function isSameMonth(a: Date, year: number, month: number): boolean {
  return a.getFullYear() === year && a.getMonth() === month
}
