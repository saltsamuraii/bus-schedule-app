export type StopId =
  | 'railway'
  | 'zavod'
  | 'akademika'
  | 'mezhdurechye'
  | 'hospital'
  | 'klyazma'

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface Stop {
  id: StopId
  name: string
}

export interface Trip {
  id: string
  routeNumber: string
  from: StopId
  to: StopId
  /** HH:mm, 24-hour */
  departAt: string
  /** HH:mm, 24-hour */
  arriveAt: string
  /** 0 = Sunday … 6 = Saturday */
  days: Weekday[]
}
