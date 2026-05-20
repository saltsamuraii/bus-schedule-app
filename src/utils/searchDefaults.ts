import type { SearchFormValues } from '../types/search'
import { todayIso } from './schedule'

export function defaultSearchValues(): SearchFormValues {
  return {
    from: 'zavod',
    to: 'railway',
    dateIso: todayIso(),
  }
}
