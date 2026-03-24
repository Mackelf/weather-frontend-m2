// src/utils/weatherHelpers.js
import { COUNTRIES, CACHE_TTL_MS } from './weatherConfig'

export const WEATHER_CODES = {
  0: { label: 'Despejado', emoji: '☀️' },
  1: { label: 'Casi despejado', emoji: '🌤️' },
  2: { label: 'Parcialmente nublado', emoji: '⛅' },
  3: { label: 'Nublado', emoji: '☁️' },
  45: { label: 'Con niebla', emoji: '🌫️' },
  48: { label: 'Niebla helada', emoji: '🌫️' },
  51: { label: 'Llovizna suave', emoji: '🌦️' },
  53: { label: 'Llovizna', emoji: '🌦️' },
  55: { label: 'Llovizna fuerte', emoji: '🌧️' },
  61: { label: 'Lluvia débil', emoji: '🌧️' },
  63: { label: 'Lluvia', emoji: '🌧️' },
  65: { label: 'Lluvia fuerte', emoji: '🌧️' },
  71: { label: 'Nieve débil', emoji: '🌨️' },
  73: { label: 'Nieve', emoji: '❄️' },
  75: { label: 'Mucha nieve', emoji: '❄️' },
  77: { label: 'Granitos de nieve', emoji: '🌨️' },
  80: { label: 'Chubascos débiles', emoji: '🌦️' },
  81: { label: 'Chubascos', emoji: '🌧️' },
  82: { label: 'Chubascos fuertes', emoji: '⛈️' },
  85: { label: 'Chubascos débiles de nieve', emoji: '🌨️' },
  86: { label: 'Chubascos de nieve fuertes', emoji: '❄️' },
  95: { label: 'Tormenta eléctrica', emoji: '⛈️' },
  96: { label: 'Tormenta eléctrica con algo de granizo', emoji: '⛈️' },
  99: { label: 'Tormenta eléctrica con mucho granizo', emoji: '⛈️' },
}

export function getWeather(code) {
  return WEATHER_CODES[code] ?? { label: 'Desconocido', emoji: '🌡️' }
}

export function getIconClass(code) {
  if (code === 0 || code === 1) return 'bi bi-sun-fill'
  if (code === 2) return 'bi bi-cloud-sun-fill'
  if (code === 3) return 'bi bi-cloud-fill'
  if (code === 45 || code === 48) return 'bi bi-cloud-fog2-fill'
  if ([51, 53, 55, 61, 63, 65, 80, 81].includes(code))
    return 'bi bi-cloud-rain-fill'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'bi bi-snow2'
  if ([95, 96, 99].includes(code)) return 'bi bi-cloud-lightning-rain-fill'
  return 'bi bi-thermometer-half'
}

export function normalizeLocations(rawLocations, countryKey) {
  const cfg = COUNTRIES[countryKey]
  if (!cfg) return []

  return rawLocations.map((loc, i) => ({
    city: (cfg.cities ?? [])[i] ?? `Ubicación ${i + 1}`,
    temp: loc.current.temperature_2m,
    code: loc.current.weather_code,
    maxTemp: loc.daily.temperature_2m_max[0],
    minTemp: loc.daily.temperature_2m_min[0],
    forecast: loc.daily.time.map((date, j) => ({
      date,
      code: loc.daily.weather_code[j],
      maxTemp: loc.daily.temperature_2m_max[j],
      minTemp: loc.daily.temperature_2m_min[j],
    })),
  }))
}

export function getForecastStats(forecast) {
  if (!forecast || forecast.length < 2) {
    return {
      avgTemp: '-',
      alerts: [],
      weekType: {
        icon: 'bi bi-question-circle',
        label: 'Semana variada',
        css: 'week--varied',
      },
    }
  }

  const next7 = forecast.slice(1, 8)

  const avgTemp =
    next7.reduce((sum, d) => sum + (d.maxTemp + d.minTemp) / 2, 0) /
    next7.length

  const alerts = []

  const hotDays = next7.filter((d) => d.maxTemp >= 25)
  if (hotDays.length > 0) {
    const peakTemp = Math.max(...hotDays.map((d) => d.maxTemp))
    alerts.push({
      type: 'heat',
      icon: 'bi bi-thermometer-sun',
      text: `Alerta de calor — hasta ${peakTemp.toFixed(1)}°C`,
    })
  }

  const coldDays = next7.filter((d) => d.minTemp <= 5)
  if (coldDays.length > 0) {
    const peakCold = Math.min(...coldDays.map((d) => d.minTemp))
    alerts.push({
      type: 'cold',
      icon: 'bi bi-snow2',
      text: `Alerta de frío — hasta ${peakCold.toFixed(1)}°C`,
    })
  }

  const RAIN_CODES = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99]
  const rainyDays = next7.filter((d) => RAIN_CODES.includes(d.code))
  if (rainyDays.length >= 3) {
    alerts.push({
      type: 'rain',
      icon: 'bi bi-cloud-rain-heavy-fill',
      text: `Semana lluviosa — ${rainyDays.length} días con lluvia`,
    })
  }

  const CLOUDY_CODES = [2, 3, 45, 48]
  const CLEAR_CODES = [0, 1]

  const clearDays = next7.filter((d) => CLEAR_CODES.includes(d.code)).length
  const cloudyDays = next7.filter((d) => CLOUDY_CODES.includes(d.code)).length
  const rainyCount = rainyDays.length

  let weekType
  const max = Math.max(clearDays, cloudyDays, rainyCount)

  if (max === 0) {
    weekType = {
      icon: 'bi bi-question-circle',
      label: 'Semana variada',
      css: 'week--varied',
    }
  } else if (clearDays === max) {
    weekType = {
      icon: 'bi bi-sun-fill',
      label: 'Semana despejada',
      css: 'week--clear',
    }
  } else if (cloudyDays === max) {
    weekType = {
      icon: 'bi bi-cloud-fill',
      label: 'Semana nublada',
      css: 'week--cloudy',
    }
  } else {
    weekType = {
      icon: 'bi bi-cloud-rain-fill',
      label: 'Semana lluviosa',
      css: 'week--rainy',
    }
  }

  return { avgTemp: avgTemp.toFixed(1), alerts, weekType }
}

export function loadWeatherData(countryKey) {
  const cfg = COUNTRIES[countryKey]
  if (!cfg) return null

  const raw = localStorage.getItem(cfg.cacheKey)
  if (!raw) {
    console.log(`[Cache][${countryKey}] Sin datos en caché.`)
    return null
  }

  try {
    const { timestamp, data } = JSON.parse(raw)
    const age = Date.now() - timestamp
    if (age > CACHE_TTL_MS) {
      localStorage.removeItem(cfg.cacheKey)
      console.log(`[Cache][${countryKey}] Expirado. Refrescando...`)
      return null
    }
    console.log(
      `[Cache][${countryKey}] Usando caché (${(age / 3600000).toFixed(1)}h).`
    )
    return data
  } catch (e) {
    console.warn(
      `[Cache][${countryKey}] Error parseando caché, se limpia.`,
      e
    )
    localStorage.removeItem(cfg.cacheKey)
    return null
  }
}

export function saveWeatherData(countryKey, data) {
  const cfg = COUNTRIES[countryKey]
  if (!cfg) return
  const payload = { timestamp: Date.now(), data }
  localStorage.setItem(cfg.cacheKey, JSON.stringify(payload))
  console.log(
    `[Cache][${countryKey}] Guardado:`,
    new Date().toLocaleTimeString()
  )
}

export function getThemeByTime() {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 18) return 'theme-day'
  if (hour >= 18 && hour < 21) return 'theme-afternoon'
  return 'theme-night'
}
