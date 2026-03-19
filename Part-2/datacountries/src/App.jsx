import { useEffect, useState } from 'react'
import CountryDetails from './components/CountryDetails'
import CountryList from './components/CountryList'
import './App.css'

const allCountriesUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const loadCountries = async () => {
      try {
        const response = await fetch(allCountriesUrl, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Could not load countries')
        }

        const countryData = await response.json()
        setCountries(countryData)
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        setErrorMessage('Could not load countries. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    loadCountries()

    return () => {
      controller.abort()
    }
  }, [])

  const searchTerm = search.trim().toLowerCase()
  const matchingCountries =
    searchTerm === ''
      ? []
      : countries.filter(country => {
          const commonName = country.name.common.toLowerCase()
          const officialName = country.name.official.toLowerCase()

          return (
            commonName.includes(searchTerm) || officialName.includes(searchTerm)
          )
        })

  let results = (
    <div className="info-panel">
      Start typing to explore countries and their details.
    </div>
  )

  if (isLoading) {
    results = <div className="info-panel">Loading countries...</div>
  } else if (errorMessage) {
    results = <div className="info-panel error">{errorMessage}</div>
  } else if (searchTerm !== '' && matchingCountries.length > 10) {
    results = (
      <div className="info-panel warning">
        Too many matches, specify another filter
      </div>
    )
  } else if (matchingCountries.length > 1) {
    results = <CountryList countries={matchingCountries} />
  } else if (matchingCountries.length === 1) {
    results = <CountryDetails country={matchingCountries[0]} />
  } else if (searchTerm !== '') {
    results = <div className="info-panel warning">No matches found.</div>
  }

  return (
    <main className="app-shell">
      <section className="search-card">
        <p className="eyebrow">Part 2.18</p>
        <h1>Data for countries</h1>
        <p className="lead">
          Search for a country to see matching results, key facts, languages,
          and its flag.
        </p>
        <label className="search-label" htmlFor="country-search">
          Find countries
        </label>
        <input
          id="country-search"
          className="search-input"
          type="text"
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Try Finland, Brazil, or Japan"
        />
      </section>

      <section className="results-area">{results}</section>
    </main>
  )
}

export default App
