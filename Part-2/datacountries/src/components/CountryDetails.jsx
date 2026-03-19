import Weather from './Weather'

const CountryDetails = ({ country }) => {
  const capitals = country.capital ?? []
  const languages = Object.values(country.languages ?? {})
  const area = new Intl.NumberFormat('en-US').format(country.area)

  return (
    <article className="country-card">
      <div className="country-header">
        <div>
          <p className="country-official">{country.name.official}</p>
          <h2>{country.name.common}</h2>
        </div>
        <img
          className="flag-image"
          src={country.flags.svg ?? country.flags.png}
          alt={country.flags.alt ?? `Flag of ${country.name.common}`}
        />
      </div>

      <div className="country-facts">
        <div className="fact-tile">
          <span className="fact-label">
            {capitals.length > 1 ? 'Capitals' : 'Capital'}
          </span>
          <strong>
            {capitals.length > 0 ? capitals.join(', ') : 'Not available'}
          </strong>
        </div>
        <div className="fact-tile">
          <span className="fact-label">Area</span>
          <strong>{area} km^2</strong>
        </div>
      </div>

      <div className="language-block">
        <h3>Languages</h3>
        <ul className="language-list">
          {languages.map(language => (
            <li key={language}>{language}</li>
          ))}
        </ul>
      </div>

      <Weather country={country} />
    </article>
  )
}

export default CountryDetails
