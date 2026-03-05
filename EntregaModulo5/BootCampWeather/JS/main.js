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

// ─── API Client ────────────────────────────────────────────────────────────
class WeatherApiClient {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async fetchWeatherData() {
    const response = await fetch(this.apiUrl);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  }
}

// ─── Weather App ───────────────────────────────────────────────────────────
class WeatherApp {
  // Constantes de la clase
  static CACHE_KEY = "weatherCache";
  static CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 horas en milisegundos

  static CITIES = [
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

  constructor(apiClient, gridElementId) {
    this.apiClient = apiClient; // instancia de WeatherApiClient
    this.lugares = []; // datos normalizados de cada ciudad
    this.grid = document.getElementById(gridElementId);
  }

  // ── Caché ────────────────────────────────────────────────────────────────

  /**
   * Guarda los datos en localStorage junto a un timestamp.
   * @param {Array} data - Array de datos normalizados
   */
  saveWeatherData(data) {
    const payload = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(WeatherApp.CACHE_KEY, JSON.stringify(payload));
    console.log("[Cache] Datos guardados:", new Date().toLocaleTimeString());
  }

  /**
   * Carga los datos del caché si existen y no han expirado.
   * @returns {Array|null} datos cacheados o null si expiró / no existe
   */
  loadWeatherData() {
    const raw = localStorage.getItem(WeatherApp.CACHE_KEY);
    if (!raw) {
      console.log("[Cache] Sin datos en caché.");
      return null;
    }

    const { timestamp, data } = JSON.parse(raw);
    const age = Date.now() - timestamp;
    const hoursOld = (age / 1000 / 60 / 60).toFixed(1);

    if (age > WeatherApp.CACHE_TTL_MS) {
      console.log(`[Cache] Caché expirado (${hoursOld}h). Refrescando...`);
      localStorage.removeItem(WeatherApp.CACHE_KEY);
      return null;
    }

    console.log(`[Cache] Usando caché (${hoursOld}h de antigüedad).`);
    return data;
  }

  // ── Normalización ────────────────────────────────────────────────────────

  /**
   * Transforma la respuesta cruda de la API al formato interno.
   * @ param {Array} rawLocations - Array de objetos devueltos por la API
   
   * @ returns {Array} lugares normalizados
   */

  normalizeLocations(rawLocations) {
    return rawLocations.map((loc, i) => ({
      city: WeatherApp.CITIES[i] ?? `Ubicación ${i + 1}`,
      temp: loc.current.temperature_2m,
      code: loc.current.weather_code,
      maxTemp: loc.daily.temperature_2m_max[0],
      minTemp: loc.daily.temperature_2m_min[0],
    }));
  }

  // ── Helpers visuales ─────────────────────────────────────────────────────

  getWeather(code) {
    return WEATHER_CODES[code] ?? { label: "Desconocido", emoji: "🌡️" };
  }

  getCardClass(code) {
    if (code === 0 || code === 1) return "weather-card--sunny";
    if (code === 2) return "weather-card--p-cloudy";
    if (code === 3) return "weather-card--cloudy";
    if (code === 45 || code === 48) return "weather-card--fog";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
      return "weather-card--rain";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "weather-card--snowy";
    if ([95, 96, 99].includes(code)) return "weather-card--stormy";
    return "card-default";
  }

  getIconClass(code) {
    if (code === 0 || code === 1) return "bi bi-sun-fill";
    if (code === 2) return "bi bi-cloud-sun-fill";
    if (code === 3) return "bi bi-cloud-fill";
    if (code === 45 || code === 48) return "bi bi-cloud-fog2-fill";
    if ([51, 53, 55, 61, 63, 65, 80, 81].includes(code))
      return "bi bi-cloud-rain-fill";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "bi bi-snow2";
    if ([95, 96, 99].includes(code)) return "bi bi-cloud-lightning-rain-fill";
    return "bi bi-thermometer-half";
  }

  // ── Detector de tiempo. Aplicacion de Theme─────

  getThemeByTime() {
    const hour = new Date().getHours();
    
    // Mañana/Tarde: 6:00 AM a 5:59 PM
    if (hour >= 6 && hour < 18) {
      return "theme-day";
    } 
    // Atardecer: 6:00 PM a 8:59 PM
    else if (hour >= 18 && hour < 21) {
      return "theme-afternoon";
    } 
    // Noche: 9:00 PM a 5:59 AM
    else {
      return "theme-night";
    }
  }



  // ── Render ───────────────────────────────────────────────────────────────

renderCards() {
  this.grid.innerHTML = "";
  
  // 1. Detectar el tema actual
  const timeTheme = this.getThemeByTime();
  
  // 2. Aplicar el tema al body para que el fondo general cambie
  document.body.className = timeTheme;

  this.lugares.forEach(({ city, temp, code, maxTemp, minTemp }) => {
    const wx = this.getWeather(code);
    const iconClass = this.getIconClass(code);
    const cardClass = this.getCardClass(code);
    const today = new Date().toLocaleDateString("es-CL", { 
      day: "2-digit", month: "short" 
    });

    const col = document.createElement("div");
    col.className = "col d-flex justify-content-center";

    // 3. Inyectar el timeTheme en las clases de la card
    col.innerHTML = `
      <div class="card weather-card ${cardClass} ${timeTheme}">
        <div class="card-header d-flex justify-content-between">
          <span class="weather-dot"></span>
          <span class="small text-uppercase">${city}</span>
          <span class="small text-uppercase">${today}</span>
        </div>
        <hr>
        <div class="weather-main text-center">
          <i class="${iconClass} weather-main__icon"></i>
          <div class="temp-now">${temp}<span>°C</span></div>
          <div class="weather-desc">${wx.label}</div>
        </div>
        <div class="temp-range d-flex justify-content-between mt-2 small">
          <span class="temp-min">↓ ${minTemp}°C</span>
          <span class="temp-max">↑ ${maxTemp}°C</span>
        </div>
        <button class="btn btn-detalles mt-3">Detalles ></button>
      </div>`;
    this.grid.appendChild(col);
  });
}

  renderError(message) {
    this.grid.innerHTML = `
      <div class="error">
        No se pudo cargar el clima.<br>
        <small>${message}</small>
      </div>`;
  }

  // ── Flujo principal ──────────────────────────────────────────────────────

  /**
   * Punto de entrada: intenta caché → si no, llama a la API → renderiza.
   */
  async init() {
    // 1. Intentar cargar desde caché
    const cached = this.loadWeatherData();

    if (cached) {
      // Caché válido: usar directamente
      this.lugares = cached;
      this.renderCards();
      return;
    }

    // 2. Sin caché o expirado: llamar a la API
    try {
      const raw = await this.apiClient.fetchWeatherData();
      const locations = Array.isArray(raw) ? raw : [raw];

      this.lugares = this.normalizeLocations(locations);

      // 3. Guardar en caché para próximas visitas
      this.saveWeatherData(this.lugares);

      this.renderCards();
    } catch (err) {
      console.error("[WeatherApp] Error fetching data:", err);
      this.renderError(err.message);
    }
  }
}

// ─── Bootstrap ────────────────────────────────────────────────────────────
const API_URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=-18.4746,-20.2133,-23.6509,-27.3668,-29.9027,-33.0472,-33.4489,-34.1708,-35.4264,-36.0667,-36.8270,-38.7359,-39.8142,-41.4693,-45.5752,-53.1638" +
  "&longitude=-70.2979,-70.1503,-70.3975,-70.3322,-71.2519,-71.6127,-70.6693,-70.7444,-71.6554,-71.9167,-73.0498,-72.5904,-73.2459,-72.9411,-72.0662,-70.9171" +
  "&current=temperature_2m,weather_code" +
  "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
  "&timezone=America/Santiago";

const apiClient = new WeatherApiClient(API_URL);
const app = new WeatherApp(apiClient, "grid");
app.init();

/*
```

---

## Qué cambió y por qué

**Separación de responsabilidades en dos clases:**

- **`WeatherApiClient`** — sólo sabe hablar con la API. Recibe la URL en el constructor, tiene un único método `fetchWeatherData()`. Si mañana cambias la API, sólo tocas esta clase.

- **`WeatherApp`** — orquesta todo lo demás. Recibe el cliente como dependencia (`apiClient`), lo que se llama *inyección de dependencias* — facilita testing porque puedes pasarle un cliente falso.

**Caché con TTL de 6 horas:**
```
init()
  ↓
loadWeatherData()  →  ¿existe en localStorage y tiene < 6h?
  ├── SÍ → usar datos cacheados, renderizar
  └── NO → fetchWeatherData() → normalizar → saveWeatherData() → renderizar */
