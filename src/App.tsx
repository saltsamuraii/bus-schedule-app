import { useMemo, useState } from 'react'
import './App.css'
import { SearchForm } from './components/SearchForm'
import { defaultSearchValues } from './utils/searchDefaults'
import type { SearchFormValues } from './types/search'
import { TripList } from './components/TripList'
import { CITY_NAME, TRIPS } from './data/pushkino'
import { sanitizeIsoDate, sanitizeStopId } from './utils/security'
import { findTrips } from './utils/schedule'

function readInitialFromUrl(): SearchFormValues {
  const defaults = defaultSearchValues()
  if (typeof window === 'undefined') return defaults

  const params = new URLSearchParams(window.location.search)
  const from = sanitizeStopId(params.get('from'))
  const to = sanitizeStopId(params.get('to'))
  const dateIso = sanitizeIsoDate(params.get('date'))

  return {
    from: from ?? defaults.from,
    to: to ?? defaults.to,
    dateIso: dateIso ?? defaults.dateIso,
  }
}

function App() {
  const [search, setSearch] = useState<SearchFormValues>(readInitialFromUrl)
  const [searched, setSearched] = useState(() => {
    if (typeof window === 'undefined') return false
    return new URLSearchParams(window.location.search).has('from')
  })

  const trips = useMemo(
    () =>
      findTrips(TRIPS, {
        from: search.from,
        to: search.to,
        dateIso: search.dateIso,
        onlyUpcoming: true,
      }),
    [search],
  )

  const handleSearch = (values: SearchFormValues) => {
    setSearch(values)
    setSearched(true)

    const url = new URL(window.location.href)
    url.searchParams.set('from', values.from)
    url.searchParams.set('to', values.to)
    url.searchParams.set('date', values.dateIso)
    window.history.replaceState(null, '', url.toString())
  }

  return (
    <div className="app">
      <header className="app__header">
        <p className="app__eyebrow">Пригородные автобусы</p>
        <h1 className="app__title">Расписание · {CITY_NAME}</h1>
        <p className="app__subtitle">
          Поиск ближайших рейсов между остановками города
        </p>
      </header>

      <main className="app__main">
        <SearchForm
          key={`${search.from}-${search.to}-${search.dateIso}`}
          initial={search}
          onSearch={handleSearch}
        />
        <TripList
          trips={trips}
          from={search.from}
          to={search.to}
          dateIso={search.dateIso}
          searched={searched}
        />
      </main>

      <footer className="app__footer">
        <p>
          Демо-данные для прототипа. Расписание можно заменить в{' '}
          <code>src/data/pushkino.ts</code>.
        </p>
      </footer>
    </div>
  )
}

export default App
