import { useEffect, useState } from 'react'

const apiKey = import.meta.env.VITE_SOME_KEY

const Weather = ({ country }) => {
  const capitalName = country.capital?.[0] ?? 'the capital city'
  const coordinates = country.capitalInfo?.latlng ?? country.latlng
  const lat = coordinates?.[0]
  const lon = coordinates?.[1]
  const [weather, setWeather] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(apiKey && coordinates))
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    if (!apiKey) {
      setWeather(null)
      setIsLoading(false)
      setErrorMessage('Weather data is unavailable. Set VITE_SOME_KEY and restart the dev server.')
      return
    }

    if (lat === undefined || lon === undefined) {
      setWeather(null)
      setIsLoading(false)
      setErrorMessage('Weather data is unavailable for this country.')
      return
    }

    const controller = new AbortController()

    const loadWeather = async () => {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error('Could not load weather data')
        }

        const weatherData = await response.json()
        setWeather(weatherData)
      } catch (error) {
        if (error.name === 'AbortError') {
          return
        }

        setErrorMessage('Could not load weather data right now.')
      } finally {
        setIsLoading(false)
      }
    }

    loadWeather()

    return () => {
      controller.abort()
    }
  }, [lat, lon])

  const currentWeather = weather?.weather?.[0]
  const iconCode = currentWeather?.icon
  const iconUrl = iconCode
    ? `https://openweathermap.org/payload/api/media/file/${iconCode}@2x.png`
    : null

  return (
    <section className="weather-card">
      <h3>Weather in {capitalName}</h3>

      {isLoading && <p>Loading weather...</p>}

      {!isLoading && errorMessage && (
        <p className="weather-message error">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && weather && (
        <div className="weather-content">
          <p>
            temperature <strong>{Math.round(weather.main.temp)} Celsius</strong>
          </p>
          {iconUrl && (
            <img
              className="weather-icon"
              src={iconUrl}
              alt={currentWeather.description}
            />
          )}
          <p>
            wind <strong>{weather.wind.speed} m/s</strong>
          </p>
        </div>
      )}
    </section>
  )
}

export default Weather
