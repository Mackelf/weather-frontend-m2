// ─── WMO Weather Code → { label, emoji } ─────────────────────────────────
const WEATHER_CODES = {
  0:  { label: "Despejado", emoji: "☀️" },
  1:  { label: "Casi despejado", emoji: "🌤️" },
  2:  { label: "Parcialmente nublado", emoji: "⛅" },
  3:  { label: "Nublado", emoji: "☁️" },
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
  static CACHE_TTL_MS = 6 * 60 * 60 * 1000;

  constructor(apiClient, gridElementId) {
    this.apiClient = apiClient;
    this.lugares   = [];
    this.grid      = document.getElementById(gridElementId);
  }

  // ── Caché ────────────────────────────────────────────────────────────────

  saveWeatherData(data) {
    const payload = { timestamp: Date.now(), data };
    localStorage.setItem(this.cacheKey ?? "weatherCache", JSON.stringify(payload));
    console.log("[Cache] Datos guardados:", new Date().toLocaleTimeString());
  }

  loadWeatherData() {
    const key = this.cacheKey ?? "weatherCache";
    const raw = localStorage.getItem(key);
    if (!raw) {
      console.log("[Cache] Sin datos en caché.");
      return null;
    }
    const { timestamp, data } = JSON.parse(raw);
    const age      = Date.now() - timestamp;
    const hoursOld = (age / 1000 / 60 / 60).toFixed(1);

    if (age > WeatherApp.CACHE_TTL_MS) {
      console.log(`[Cache] Caché expirado (${hoursOld}h). Refrescando...`);
      localStorage.removeItem(key);
      return null;
    }
    console.log(`[Cache] Usando caché (${hoursOld}h de antigüedad).`);
    return data;
  }

  // ── Normalización ─────────────────────────────────────────────────────────

  normalizeLocations(rawLocations) {
    return rawLocations.map((loc, i) => ({
      city:    (this.cities ?? [])[i] ?? `Ubicación ${i + 1}`,
      temp:    loc.current.temperature_2m,
      code:    loc.current.weather_code,
      maxTemp: loc.daily.temperature_2m_max[0],
      minTemp: loc.daily.temperature_2m_min[0],
      // ✅ Array completo para el popover
      forecast: loc.daily.time.map((date, j) => ({
        date,
        code:    loc.daily.weather_code[j],
        maxTemp: loc.daily.temperature_2m_max[j],
        minTemp: loc.daily.temperature_2m_min[j],
      })),
    }));
  }

  // ── Helpers visuales ──────────────────────────────────────────────────────

  getWeather(code) {
    return WEATHER_CODES[code] ?? { label: "Desconocido", emoji: "🌡️" };
  }

  getCardClass(code) {
    if (code === 0 || code === 1) return "weather-card--sunny";
    if (code === 2)               return "weather-card--p-cloudy";
    if (code === 3)               return "weather-card--cloudy";
    if (code === 45 || code === 48) return "weather-card--fog";
    if ([51,53,55,61,63,65,80,81,82].includes(code)) return "weather-card--rain";
    if ([71,73,75,77,85,86].includes(code))          return "weather-card--snowy";
    if ([95,96,99].includes(code))                   return "weather-card--stormy";
    return "card-default";
  }

  getIconClass(code) {
    if (code === 0 || code === 1)   return "bi bi-sun-fill";
    if (code === 2)                 return "bi bi-cloud-sun-fill";
    if (code === 3)                 return "bi bi-cloud-fill";
    if (code === 45 || code === 48) return "bi bi-cloud-fog2-fill";
    if ([51,53,55,61,63,65,80,81].includes(code)) return "bi bi-cloud-rain-fill";
    if ([71,73,75,77,85,86].includes(code))       return "bi bi-snow2";
    if ([95,96,99].includes(code)) return "bi bi-cloud-lightning-rain-fill";
    return "bi bi-thermometer-half";
  }

  getThemeByTime() {
    const hour = new Date().getHours();
    if (hour >= 6  && hour < 18) return "theme-day";
    if (hour >= 18 && hour < 21) return "theme-afternoon";
    return "theme-night";
  }

  // ── Estadisticas ───────────────────────────────────────────────────────
  getForecastStats(forecast) {
  const next7 = forecast.slice(1, 8);

  // ── Temperatura promedio ──────────────────────────────────────────────
  const avgTemp = next7.reduce((sum, d) => sum + (d.maxTemp + d.minTemp) / 2, 0) / next7.length;

  // ── Alertas ───────────────────────────────────────────────────────────
  const alerts = [];

  // 🌡️ Calor: algún día supera 25°C en máxima
  const hotDays = next7.filter(d => d.maxTemp >= 25);
  if (hotDays.length > 0) {
    const peakTemp = Math.max(...hotDays.map(d => d.maxTemp));
    alerts.push({
      type: "heat",
      icon: "bi bi-thermometer-sun",
      text: `Alerta de calor — hasta ${peakTemp}°C`,
    });
  }

  // 🧊 Frío: algún día baja de 5°C en mínima
  const coldDays = next7.filter(d => d.minTemp <= 5);
  if (coldDays.length > 0) {
    const peakCold = Math.min(...coldDays.map(d => d.minTemp));
    alerts.push({
      type: "cold",
      icon: "bi bi-snow2",
      text: `Alerta de frío — hasta ${peakCold}°C`,
    });
  }

  // 🌧️ Semana lluviosa: 3 o más días con lluvia/tormenta
  const RAIN_CODES = [51,53,55,61,63,65,80,81,82,95,96,99];
  const rainyDays  = next7.filter(d => RAIN_CODES.includes(d.code));
  if (rainyDays.length >= 3) {
    alerts.push({
      type: "rain",
      icon: "bi bi-cloud-rain-heavy-fill",
      text: `Semana lluviosa — ${rainyDays.length} días con lluvia`,
    });
  }

  // ── Tipo de semana ────────────────────────────────────────────────────
  const CLOUDY_CODES = [2, 3, 45, 48];
  const CLEAR_CODES  = [0, 1];

  const clearDays  = next7.filter(d => CLEAR_CODES.includes(d.code)).length;
  const cloudyDays = next7.filter(d => CLOUDY_CODES.includes(d.code)).length;
  const rainyCount = rainyDays.length;

  // La categoría con más días gana
  let weekType;
  const max = Math.max(clearDays, cloudyDays, rainyCount);

  if (max === 0) {
    weekType = { icon: "bi bi-question-circle", label: "Semana variada",      css: "week--varied"  };
  } else if (clearDays === max) {
    weekType = { icon: "bi bi-sun-fill",        label: "Semana despejada",    css: "week--clear"   };
  } else if (cloudyDays === max) {
    weekType = { icon: "bi bi-cloud-fill",      label: "Semana nublada",      css: "week--cloudy"  };
  } else {
    weekType = { icon: "bi bi-cloud-rain-fill", label: "Semana lluviosa",     css: "week--rainy"   };
  }

  return { avgTemp: avgTemp.toFixed(1), alerts, weekType };
}

  // ── Render ───────────────────────────────────────────────────────────────


buildForecastHTML(forecast) {
  const { avgTemp, alerts, weekType } = this.getForecastStats(forecast);

  // ── Alertas ──
  const alertsHTML = alerts.length > 0
    ? `<div class="forecast-alerts">
        ${alerts.map(a => `
          <div class="forecast-alert forecast-alert--${a.type}">
            <i class="${a.icon}"></i> ${a.text}
          </div>`).join("")}
       </div>`
    : "";

  // ── Stats: promedio + tipo de semana ──
  const statsHTML = `
    <div class="forecast-stats">
      <div class="stat-item">
        <i class="bi bi-thermometer-half"></i>
        <span>Promedio semanal: <strong>${avgTemp}°C</strong></span>
      </div>
      <div class="stat-item week-type ${weekType.css}">
        <i class="${weekType.icon}"></i>
        <span>${weekType.label}</span>
      </div>
    </div>`;

  // ── Días (sin cambios) ──
  const daysHTML = `
    <div class="forecast-row">
      ${forecast.slice(1, 8).map(({ date, code, maxTemp, minTemp }) => {
        const wx        = this.getWeather(code);
        const iconClass = this.getIconClass(code);
        const dotClass  = this.getCardClass(code);
        const label     = new Date(date + "T12:00:00")
                            .toLocaleDateString("es-CL", { weekday: "short", day: "2-digit" });
        return `
          <div class="forecast-day-card">
            <span class="forecast-label">${label}</span>
            <i class="${iconClass} forecast-icon"></i>
            <span class="weather-dot ${dotClass}"></span>
            <span class="forecast-desc">${wx.label}</span>
            <span class="forecast-max">↑ ${maxTemp}°</span>
            <span class="forecast-min">↓ ${minTemp}°</span>
          </div>`;
      }).join("")}
    </div>`;

  return alertsHTML + statsHTML + daysHTML;
}

  renderCards() {
    this.grid.innerHTML = "";
    const timeTheme = this.getThemeByTime();
    document.body.className = timeTheme;

    // ✅ forecast incluido en el destructuring
    this.lugares.forEach(({ city, temp, code, maxTemp, minTemp, forecast }) => {
      const wx        = this.getWeather(code);
      const iconClass = this.getIconClass(code);
      const cardClass = this.getCardClass(code);
      const today     = new Date().toLocaleDateString("es-CL", { day: "2-digit", month: "short" });

      // ✅ punto y coma correcto
      const forecastHTML = this.buildForecastHTML(forecast);

      const col = document.createElement("div");
      col.className = "col d-flex justify-content-center";

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
          <button class="btn btn-detalles mt-3"
                  data-bs-toggle="popover"
                  data-bs-placement="bottom"
                  data-bs-html="true"
                  data-bs-title="${city} — próximos 7 días"
                  data-bs-content="${this.escapeAttr(forecastHTML)}">
            Detalles >
          </button>
        </div>`;

      this.grid.appendChild(col);
    });

    // ✅ Se llama al final, cuando todos los botones ya están en el DOM
    this.initPopovers();
  }

  renderError(message) {
    this.grid.innerHTML = `
      <div class="error">
        No se pudo cargar el clima.<br>
        <small>${message}</small>
      </div>`;
  }

  // ── Helpers del popover ───────────────────────────────────────────────────

  escapeAttr(html) {
    return html
      .replace(/&/g,  "&amp;")
      .replace(/"/g,  "&quot;")
      .replace(/'/g,  "&#39;")
      .replace(/\n/g, "")
      .replace(/\s+/g, " ");
  }

  initPopovers() {
    const popoverEls = document.querySelectorAll('[data-bs-toggle="popover"]');

    const popoverInstances = [...popoverEls].map(el =>
      new bootstrap.Popover(el, { trigger: "click" })
    );

    // Cerrar al hacer click fuera
    document.addEventListener("click", (e) => {
      popoverInstances.forEach(pop => {
        const btn = pop._element;
        if (!btn.contains(e.target) && !pop.tip?.contains(e.target)) {
          pop.hide();
        }
      });
    }, { capture: true });
  }

  // ── Flujo principal ───────────────────────────────────────────────────────

  async init() {
    const cached = this.loadWeatherData();
    if (cached) {
      this.lugares = cached;
      this.renderCards();
      return;
    }

    try {
      const raw       = await this.apiClient.fetchWeatherData();
      const locations = Array.isArray(raw) ? raw : [raw];
      this.lugares    = this.normalizeLocations(locations);
      this.saveWeatherData(this.lugares);
      this.renderCards();
    } catch (err) {
      console.error("[WeatherApp] Error fetching data:", err);
      this.renderError(err.message);
    }
  }
}

// ─── Configuración por país ───────────────────────────────────────────────
const COUNTRIES = {
  chile: {
    label:     "Chile 🇨🇱",
    cacheKey:  "weatherCache_chile",
    timezone:  "America/Santiago",
    cities: [
      "Arica", "Iquique", "Antofagasta", "Copiapo", "La Serena",
      "Valparaiso", "Santiago", "Rancagua", "Talca", "Chillán",
      "Concepción", "Temuco", "Valdivia", "Puerto Montt", "Coyhaique", "Punta Arenas",
    ],
    apiUrl:
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=-18.4746,-20.2133,-23.6509,-27.3668,-29.9027,-33.0472,-33.4489,-34.1708,-35.4264,-36.0667,-36.8270,-38.7359,-39.8142,-41.4693,-45.5752,-53.1638" +
      "&longitude=-70.2979,-70.1503,-70.3975,-70.3322,-71.2519,-71.6127,-70.6693,-70.7444,-71.6554,-71.9167,-73.0498,-72.5904,-73.2459,-72.9411,-72.0662,-70.9171" +
      "&current=temperature_2m,weather_code" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
      "&timezone=America/Santiago",
  },

  argentina: {
    label:    "Argentina 🇦🇷",
    cacheKey: "weatherCache_argentina",
    timezone: "America/Argentina/Buenos_Aires",
    cities: [
      "Buenos Aires", "Córdoba", "Rosario", "Posadas", "San Salvador de Jujuy",
      "Catamarca", "Formosa", "Resistencia", "Paraná", "San Juan",
      "San Luis", "Santa Rosa", "Neuquén", "Rawson", "Viedma",
      "Río Gallegos", "Ushuaia", "Bahía Blanca", "Sgo. del Estero", "Tucumán",
      "Salta", "La Plata", "Mendoza", "La Rioja",
    ],
    apiUrl:
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=-34.6132,-31.4135,-32.9468,-27.3671,-24.1858,-28.4696,-26.1849,-27.4606,-31.7333,-31.5375,-33.3017,-32.4847,-36.6167,-38.9516,-43.3002,-40.8135,-45.8641,-54.8019,-38.7196,-27.8006,-26.8241,-24.7859,-34.9215,-33.2950" +
      "&longitude=-58.3772,-64.1811,-60.6393,-55.8961,-65.2995,-65.7852,-58.1731,-58.9839,-60.5298,-68.5364,-66.3378,-58.2321,-64.2833,-68.0591,-65.1023,-62.9967,-67.4808,-68.3030,-62.2724,-64.2615,-65.2226,-65.4117,-57.9545,-66.3356" +
      "&current=temperature_2m,weather_code" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
      "&timezone=America/Argentina/Buenos_Aires",
  },
};

// ─── Bootstrap ───────────────────────────────────────────────────────────
let currentCountry = "chile";

function buildApp(countryKey) {
  const country   = COUNTRIES[countryKey];
  const apiClient = new WeatherApiClient(country.apiUrl);

  // Inyecta ciudades y cacheKey dinámicamente en la instancia
  const app = new WeatherApp(apiClient, "grid");
  app.cities   = country.cities;
  app.cacheKey = country.cacheKey;

  // Sobrescribe normalizeLocations para usar las ciudades del país activo
  app.normalizeLocations = function(rawLocations) {
    return rawLocations.map((loc, i) => ({
      city:     this.cities[i] ?? `Ciudad ${i + 1}`,
      temp:     loc.current.temperature_2m,
      code:     loc.current.weather_code,
      maxTemp:  loc.daily.temperature_2m_max[0],
      minTemp:  loc.daily.temperature_2m_min[0],
      forecast: loc.daily.time.map((date, j) => ({
        date,
        code:    loc.daily.weather_code[j],
        maxTemp: loc.daily.temperature_2m_max[j],
        minTemp: loc.daily.temperature_2m_min[j],
      })),
    }));
  };

  // Sobrescribe save/load para usar la cacheKey del país
  app.saveWeatherData = function(data) {
    const payload = { timestamp: Date.now(), data };
    localStorage.setItem(this.cacheKey, JSON.stringify(payload));
    console.log(`[Cache][${countryKey}] Guardado:`, new Date().toLocaleTimeString());
  };

  app.loadWeatherData = function() {
    const raw = localStorage.getItem(this.cacheKey);
    if (!raw) return null;
    const { timestamp, data } = JSON.parse(raw);
    const age = Date.now() - timestamp;
    if (age > WeatherApp.CACHE_TTL_MS) {
      localStorage.removeItem(this.cacheKey);
      console.log(`[Cache][${countryKey}] Expirado. Refrescando...`);
      return null;
    }
    console.log(`[Cache][${countryKey}] Usando caché (${(age/3600000).toFixed(1)}h).`);
    return data;
  };

  return app;
}

// ── Fade helper ───────────────────────────────────────────────────────────
function switchCountry(countryKey) {
  if (countryKey === currentCountry) return;
  if (!COUNTRIES[countryKey]) {
    console.warn(`[País] "${countryKey}" aún no está disponible.`);
    return;
  }

  currentCountry = countryKey;

  // Actualiza etiqueta del dropdown
  const toggle = document.querySelector('[data-bs-toggle="dropdown"]');
  if (toggle) toggle.textContent = `📍 ${COUNTRIES[countryKey].label}`;

  // Marca el item activo
  document.querySelectorAll('#countryDropdown .dropdown-item').forEach(el => {
    el.classList.toggle('active', el.dataset.country === countryKey);
  });

  // Fade out → carga → fade in
  const grid = document.getElementById('grid');
  grid.style.transition = "opacity .3s ease";
  grid.style.opacity    = "0";

  setTimeout(() => {
    const app = buildApp(countryKey);
    app.init().then(() => {
      grid.style.opacity = "1";
    });
  }, 300);
}

// ── Listeners del dropdown ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#countryDropdown .dropdown-item').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      switchCountry(el.dataset.country);
    });
  });

  // Etiqueta inicial
  const toggle = document.querySelector('[data-bs-toggle="dropdown"]');
  if (toggle) toggle.textContent = `📍 ${COUNTRIES[currentCountry].label}`;
});

// ── Carga inicial ─────────────────────────────────────────────────────────
const app = buildApp("chile");
app.init();