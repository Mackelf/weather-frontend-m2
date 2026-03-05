/*TO DO LIST:
Proyecto Clima - Bootcamp Update
Identificar endpoint/URL final de la API del clima
Crear fetchWeatherData() con fetch/async-await y manejo de errores
Reemplazar array fijo por respuesta de la API (normalizar estructura)
Crear función saveWeatherData(data) con localStorage
Crear función loadWeatherData() con caché local y expiración por timestamp
Crear componente Vue con data(): weatherData, loading, error
Llamar loadWeatherData() en mounted() y asignar a this.weatherData
Crear tarjetas con v-for y pasar datos a componentes hijo con props
Eliminar renderizado manual del DOM y usar solo plantillas Vue
Revisar JSON de la API y mapear campos a flip card (frente/reverso) y popover
Actualizar cálculo de promedios y estado más repetido con nuevas props del JSON
Probar con casos borde: ciudades distintas, sin datos, error de API



*/
// Mapeo de ciudades
const CITIES = [
  "Arica",
  "Iquique",
  "Antofagasta",
  "Copiapo",
  "La Serena",
  "Valparaiso",
  "Santiago",
  "Rancagua",
  "Talca",
  "Chillán",
  "Concepción",
  "Temuco",
  "Valdivia",
  "Puerto Montt",
  "Coyhaique",
  "Punta Arenas",
];

// ─── WMO Weather Code → { label, emoji } ─────────────────────────────────
const WEATHER_CODES = {
  0: { label: "Despejado", emoji: "☀️" },
  1: { label: "Casi despejado", emoji: "🌤️" },
  2: { label: "Parcialmente nublado", emoji: "⛅" },
  3: { label: "Nublado", emoji: "☁️" },

  45: { label: "Con niebla", emoji: "🌫️" },
  48: { label: "Niebla helada", emoji: "🌫️" },

  51: { label: "Llovizna suave", emoji: "🌦️" },
  53: { label: "Llovizna", emoji: "🌦️" },
  55: { label: "Llovizna fuerte", emoji: "🌧️" },

  61: { label: "Lluvia débil", emoji: "🌧️" },
  63: { label: "Lluvia", emoji: "🌧️" },
  65: { label: "Lluvia fuerte", emoji: "🌧️" },

  71: { label: "Nieve débil", emoji: "🌨️" },
  73: { label: "Nieve", emoji: "❄️" },
  75: { label: "Mucha nieve", emoji: "❄️" },
  77: { label: "Granitos de nieve", emoji: "🌨️" },

  80: { label: "Chubascos débiles", emoji: "🌦️" },
  81: { label: "Chubascos", emoji: "🌧️" },
  82: { label: "Chubascos fuertes", emoji: "⛈️" },

  85: { label: "Chubascos débiles de nieve", emoji: "🌨️" },
  86: { label: "Chubascos de nieve fuertes", emoji: "❄️" },

  95: { label: "Tormenta eléctrica", emoji: "⛈️" },
  96: { label: "Tormenta eléctrica con algo de granizo", emoji: "⛈️" },
  99: { label: "Tormenta eléctrica con mucho granizo", emoji: "⛈️" },
};

function getWeather(code) {
  return WEATHER_CODES[code] ?? { label: "Desconocido", emoji: "🌡️" };
}

function getCardClassFromCode(code) {
  // Sol / despejado
  if (code === 0 || code === 1) return "weather-card--sunny";

  // Parcialmente nublado
  if (code === 2) return "weather-card--p-cloudy";

  // Nublado
  if (code === 3) return "weather-card--cloudy";

  // Niebla
  if (code === 45 || code === 48) return "weather-card--fog";

  // Lluvia / llovizna / chubascos
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "weather-card--rain";

  // Lluvia fuerte
  if (code === 65 || code === 82) return "weather-card--rain";

  // Nieve
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "weather-card--snowy";

  // Tormenta
  if ([95, 96, 99].includes(code)) return "weather-card--stormy";

  // Fallback
  return "card-default";
}


function getIconClassFromCode(code) {
  // Sol / despejado
  if (code === 0 || code === 1) return "bi bi-sun-fill";

  // Parcialmente nublado
  if (code === 2) return "bi bi-cloud-sun-fill";

  // Nublado
  if (code === 3) return "bi bi-cloud-fill";

  // Niebla
  if (code === 45 || code === 48) return "bi bi-cloud-fog2-fill";

  // Lluvia / chubascos (sin nieve)
  if ([51, 53, 55, 61, 63, 65, 80, 81].includes(code))
    return "bi bi-cloud-rain-fill";

  // Nieve / chubascos de nieve
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "bi bi-snow2";

  // Tormenta
  if ([95, 96, 99].includes(code)) return "bi bi-cloud-lightning-rain-fill";

  // Fallback
  return "bi bi-thermometer-half";
}

const API_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-18.4746,-20.2133,-23.6509,-27.3668,-29.9027,-33.0472,-33.4489,-34.1708,-35.4264,-36.0667,-36.8270,-38.7359,-39.8142,-41.4693,-45.5752,-53.1638&longitude=-70.2979,-70.1503,-70.3975,-70.3322,-71.2519,-71.6127,-70.6693,-70.7444,-71.6554,-71.9167,-73.0498,-72.5904,-73.2459,-72.9411,-72.0662,-70.9171&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=America/Santiago";
const grid = document.getElementById("grid");

fetch(API_URL)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    grid.innerHTML = "";

    const locations = Array.isArray(data) ? data : [data];
    console.log(locations);

    locations.forEach((loc, i) => {
      const city = CITIES[i] ?? `Location ${i + 1}`;
      const temp = loc.current.temperature_2m;
      const code = loc.current.weather_code;
      const wx = getWeather(code);
      const maxTemp = loc.daily.temperature_2m_max[0];
      const minTemp = loc.daily.temperature_2m_min[0];

      // Columna Bootstrap
      const iconClass = getIconClassFromCode(code);
      const cardClass = getCardClassFromCode(code);

      const col = document.createElement("div");
      col.className = "col d-flex justify-content-center";

      col.innerHTML = `
  <div class="card weather-card ${cardClass}">
    <div class="card-header d-flex justify-content-between letter-spacing: 1px">
      <span class="weather-dot"></span>
      <span class="small text-uppercase">${city}</span>
      <span class="small text-uppercase">${new Date().toLocaleDateString("es-CL", { day: "2-digit", month: "short" })}</span>
    </div>
<hr>
    <div class="weather-main text-center">
      <i class="${iconClass} weather-main__icon"></i>
      <div class="temp-now">${temp}<span>°C</span></div>
      <div class="weather-desc">${wx.label}</div>
    </div>

    <div class="temp-range d-flex justify-content-between mt-2 small">
      <span class="temp-max">↑ max: ${maxTemp}°C</span>
      <span class="temp-min">↓ min:${minTemp}°C</span>
    </div>
  </div>
`;

      grid.appendChild(col);
    });
  })
  .catch((err) => {
    grid.innerHTML = `<div class="error">Failed to load weather data.<br><small>${err.message}</small></div>`;
  });
