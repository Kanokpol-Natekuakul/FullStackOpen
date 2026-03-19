const CountryList = ({ countries, showCountry }) => {
  return (
    <ul className="country-list">
      {countries.map(country => (
        <li className="country-list-item" key={country.cca3}>
          <div className="country-summary">
            <span>{country.name.common}</span>
            <span className="country-region">{country.region}</span>
          </div>
          <button
            className="show-button"
            type="button"
            onClick={() => showCountry(country.name.common)}
          >
            show
          </button>
        </li>
      ))}
    </ul>
  )
}

export default CountryList
