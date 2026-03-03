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
  "Arica", "Iquique", "Antofagasta", "Copiapo", "La Serena", "Valparaiso", "Santiago", "Rancagua", "Talca", "Chillán", "Concepción", "Temuco", "Valdivia", "Puerto Montt", "Coyhaique", "Punta Arenas", 
];






    // ─── WMO Weather Code → { label, emoji } ─────────────────────────────────
    const WEATHER_CODES = {
      0:  { label: "Despejado",            emoji: "☀️" },
      1:  { label: "Mainly Clear",         emoji: "🌤️" },
      2:  { label: "Parcial Nublado",        emoji: "⛅" },
      3:  { label: "Overcast",             emoji: "☁️" },
      45: { label: "Niebla",                  emoji: "🌫️" },
      48: { label: "Icy Fog",              emoji: "🌫️" },
      51: { label: "Light Drizzle",        emoji: "🌦️" },
      53: { label: "Moderate Drizzle",     emoji: "🌦️" },
      55: { label: "Dense Drizzle",        emoji: "🌧️" },
      61: { label: "Slight Rain",          emoji: "🌧️" },
      63: { label: "Moderate Rain",        emoji: "🌧️" },
      65: { label: "Heavy Rain",           emoji: "🌧️" },
      71: { label: "Slight Snowfall",      emoji: "🌨️" },
      73: { label: "Moderate Snowfall",    emoji: "❄️" },
      75: { label: "Heavy Snowfall",       emoji: "❄️" },
      77: { label: "Snow Grains",          emoji: "🌨️" },
      80: { label: "Slight Showers",       emoji: "🌦️" },
      81: { label: "Moderate Showers",     emoji: "🌧️" },
      82: { label: "Violent Showers",      emoji: "⛈️" },
      85: { label: "Slight Snow Showers",  emoji: "🌨️" },
      86: { label: "Heavy Snow Showers",   emoji: "❄️" },
      95: { label: "Tormenta Electrica",         emoji: "⛈️" },
      96: { label: "Tormenta Electrica Sin Granizo", emoji: "⛈️" }, // 96: { label: "Thunderstorm w/ Hail", emoji: "⛈️" },
      99: { label: "Tormenta Electrica Con Granizo", emoji: "⛈️" },
    };

function getWeather(code) {
  return WEATHER_CODES[code] ?? { label: "Desconocido", emoji:"🌡️" };
}


    const API_URL = "https://api.open-meteo.com/v1/forecast?latitude=-18.4746,-20.2133,-23.6509,-27.3668,-29.9027,-33.0472,-33.4489,-34.1708,-35.4264,-36.0667,-36.8270,-38.7359,-39.8142,-41.4693,-45.5752,-53.1638&longitude=-70.2979,-70.1503,-70.3975,-70.3322,-71.2519,-71.6127,-70.6693,-70.7444,-71.6554,-71.9167,-73.0498,-72.5904,-73.2459,-72.9411,-72.0662,-70.9171&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=America/Santiago"

fetch(API_URL)
.then((response) => response.json())
.then((data) => {
  console.log(data)
  grid.innerHTML = "";

const locations= Array.isArray(data) ? data : [data];
console.log(locations);
locations.forEach((loc, i) => {
  const city    = CITIES[i] ?? `Location ${i + 1}`;
  const temp    = loc.current.temperature_2m;
  const code    = loc.current.weather_code;
  const wx      = getWeather(code);
  const maxTemp = loc.daily.temperature_2m_max[0];
  const minTemp = loc.daily.temperature_2m_min[0];

  const card = document.createElement("div");
  card.className = "card";
  card.style.animationDelay = `${i * 40}ms`;
  card.innerHTML = `
    <div class="card-header">
      <div class="city-name">${city}</div>
      <div class="weather-icon">${wx.emoji}</div>
    </div>
    <div class="temp-now">${temp}<span>°C</span></div>
    <div class="weather-desc">${wx.label}</div>
    <div class="temp-range">
      <span class="temp-max">↑ ${maxTemp}°C</span>
      <span class="temp-min">↓ ${minTemp}°C</span>
    </div>
  `;
  grid.appendChild(card);
});

}).catch(err => {
        grid.innerHTML = `<div class="error">Failed to load weather data.<br><small>${err.message}</small></div>`;
      });