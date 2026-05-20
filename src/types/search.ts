import type { StopId } from './schedule'

export interface SearchFormValues {
  from: StopId
  to: StopId
  dateIso: string
}
