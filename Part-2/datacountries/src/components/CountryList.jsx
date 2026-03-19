const CountryList = ({ countries }) => {
  return (
    <ul className="country-list">
      {countries.map(country => (
        <li className="country-list-item" key={country.cca3}>
          <span>{country.name.common}</span>
          <span className="country-region">{country.region}</span>
        </li>
      ))}
    </ul>
  )
}

export default CountryList
