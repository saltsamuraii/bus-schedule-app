import type { Stop, Trip } from '../types/schedule'

export const CITY_NAME = 'Пушкино'

export const STOPS: Stop[] = [
  { id: 'railway', name: 'ЖД Пушкино' },
  { id: 'zavod', name: 'Завод' },
  { id: 'akademika', name: 'пр. Академика Королёва' },
  { id: 'mezhdurechye', name: 'Междуречье' },
  { id: 'hospital', name: 'Городская больница' },
  { id: 'klyazma', name: 'Клязьма' },
]

export const STOP_IDS = STOPS.map((s) => s.id)

const weekdays = [1, 2, 3, 4, 5] as const
const weekend = [0, 6] as const
const allWeek = [0, 1, 2, 3, 4, 5, 6] as const

/** Демо-расписание пригородных маршрутов Пушкино (можно заменить на реальное). */
export const TRIPS: Trip[] = [
  // №9 Завод ↔ ЖД
  { id: '9-1', routeNumber: '9', from: 'zavod', to: 'railway', departAt: '06:30', arriveAt: '06:55', days: [...weekdays] },
  { id: '9-2', routeNumber: '9', from: 'zavod', to: 'railway', departAt: '08:15', arriveAt: '08:40', days: [...weekdays] },
  { id: '9-3', routeNumber: '9', from: 'zavod', to: 'railway', departAt: '12:00', arriveAt: '12:25', days: [...allWeek] },
  { id: '9-4', routeNumber: '9', from: 'zavod', to: 'railway', departAt: '14:55', arriveAt: '15:20', days: [...allWeek] },
  { id: '9-5', routeNumber: '9', from: 'zavod', to: 'railway', departAt: '18:30', arriveAt: '18:55', days: [...weekdays] },
  { id: '9-6', routeNumber: '9', from: 'zavod', to: 'railway', departAt: '20:45', arriveAt: '21:10', days: [...weekdays] },
  { id: '9-r1', routeNumber: '9', from: 'railway', to: 'zavod', departAt: '07:10', arriveAt: '07:35', days: [...weekdays] },
  { id: '9-r2', routeNumber: '9', from: 'railway', to: 'zavod', departAt: '09:00', arriveAt: '09:25', days: [...weekdays] },
  { id: '9-r3', routeNumber: '9', from: 'railway', to: 'zavod', departAt: '13:10', arriveAt: '13:35', days: [...allWeek] },
  { id: '9-r4', routeNumber: '9', from: 'railway', to: 'zavod', departAt: '15:40', arriveAt: '16:05', days: [...allWeek] },
  { id: '9-r5', routeNumber: '9', from: 'railway', to: 'zavod', departAt: '19:15', arriveAt: '19:40', days: [...weekdays] },

  // №22 ЖД ↔ Междуречье
  { id: '22-1', routeNumber: '22', from: 'railway', to: 'mezhdurechye', departAt: '06:45', arriveAt: '07:20', days: [...weekdays] },
  { id: '22-2', routeNumber: '22', from: 'railway', to: 'mezhdurechye', departAt: '10:30', arriveAt: '11:05', days: [...allWeek] },
  { id: '22-3', routeNumber: '22', from: 'railway', to: 'mezhdurechye', departAt: '16:00', arriveAt: '16:35', days: [...weekdays] },
  { id: '22-4', routeNumber: '22', from: 'railway', to: 'mezhdurechye', departAt: '19:30', arriveAt: '20:05', days: [...weekdays] },
  { id: '22-r1', routeNumber: '22', from: 'mezhdurechye', to: 'railway', departAt: '07:35', arriveAt: '08:10', days: [...weekdays] },
  { id: '22-r2', routeNumber: '22', from: 'mezhdurechye', to: 'railway', departAt: '11:20', arriveAt: '11:55', days: [...allWeek] },
  { id: '22-r3', routeNumber: '22', from: 'mezhdurechye', to: 'railway', departAt: '17:00', arriveAt: '17:35', days: [...weekdays] },

  // №5 пр. Академика ↔ больница
  { id: '5-1', routeNumber: '5', from: 'akademika', to: 'hospital', departAt: '07:00', arriveAt: '07:25', days: [...weekdays] },
  { id: '5-2', routeNumber: '5', from: 'akademika', to: 'hospital', departAt: '13:30', arriveAt: '13:55', days: [...allWeek] },
  { id: '5-3', routeNumber: '5', from: 'akademika', to: 'hospital', departAt: '18:00', arriveAt: '18:25', days: [...weekdays] },
  { id: '5-r1', routeNumber: '5', from: 'hospital', to: 'akademika', departAt: '07:45', arriveAt: '08:10', days: [...weekdays] },
  { id: '5-r2', routeNumber: '5', from: 'hospital', to: 'akademika', departAt: '14:15', arriveAt: '14:40', days: [...allWeek] },

  // №31 ЖД ↔ Клязьма (выходные чаще)
  { id: '31-1', routeNumber: '31', from: 'railway', to: 'klyazma', departAt: '08:00', arriveAt: '08:40', days: [...weekend] },
  { id: '31-2', routeNumber: '31', from: 'railway', to: 'klyazma', departAt: '12:30', arriveAt: '13:10', days: [...weekend] },
  { id: '31-3', routeNumber: '31', from: 'railway', to: 'klyazma', departAt: '17:00', arriveAt: '17:40', days: [...weekend] },
  { id: '31-r1', routeNumber: '31', from: 'klyazma', to: 'railway', departAt: '09:00', arriveAt: '09:40', days: [...weekend] },
  { id: '31-r2', routeNumber: '31', from: 'klyazma', to: 'railway', departAt: '14:00', arriveAt: '14:40', days: [...weekend] },
]
