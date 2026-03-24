# 🌤️ BootCamp Weather

Proyecto de portfolio desarrollado como evidencia del aprendizaje en el Bootcamp de Desarrollo Frontend — Talento Digital / SENCE.

Aplicación web SPA que muestra el **clima actual y el pronóstico de 7 días** para ciudades de Chile y Argentina. Consume la API pública de Open-Meteo sin necesidad de API key, aplica caché local independiente por país, y adapta su paleta visual según la hora del día.

---

## 🚀 Tecnologías utilizadas

- **Vue.js 3** — Composition API, `<script setup>`
- **Vue Router 4** — navegación SPA sin recarga
- **Vite** — entorno de desarrollo y build
- **Bootstrap 5** — grilla y utilidades
- **Bootstrap Icons** — íconos de clima y UI
- **SCSS** — estilos propios con variables, BEM y patrón 7-1
- **Open-Meteo API** — datos meteorológicos gratuitos y sin API key
- **rss2json API** — conversión de feed RSS a JSON para noticias
- **localStorage** — caché por país con TTL de 6 horas

---

## 📁 Estructura del proyecto

src/
├── assets/
├── components/
│ └── WeatherCard.vue # Tarjeta reutilizable de clima
├── router/
│ └── index.js # Rutas de la SPA
├── styles/
│ ├── abstracts/
│ │ ├── _variables.scss # Variables globales (colores, tipografía)
│ │ └── _mixins.scss # Mixins reutilizables
│ ├── base/
│ │ └── _reset.scss # Reset y estilos base del body
│ ├── components/
│ │ └── _weather-card.scss # Estilos de la tarjeta de clima
│ ├── layout/
│ │ └── _header.scss # Estructura del header
│ ├── themes/
│ │ └── _theme.scss # Temas visuales por hora del día
│ └── main.scss # Punto de entrada SCSS
├── utils/
│ ├── weatherConfig.js # Configuración de países, ciudades y URLs
│ └── weatherHelpers.js # Helpers compartidos: caché, normalización, iconos, stats
└── views/
├── HomeView.vue # Dashboard con clima de capitales
├── PronosticosView.vue # Listado de ciudades por país
├── LugarDetalleView.vue # Detalle semanal de una ciudad
├── NewsView.vue # Noticias desde feed RSS
└── QuienesSomosView.vue # Información del autor

text

---

## 🗺️ Rutas disponibles

| Ruta | Vista | Descripción |
|---|---|---|
| `/` | HomeView | Dashboard con capitales y accesos |
| `/pronosticos` | PronosticosView | Listado de ciudades por país |
| `/pronosticos/:country/:city` | LugarDetalleView | Detalle y forecast 7 días |
| `/news` | NewsView | Noticias de clima desde RSS |
| `/about` | QuienesSomosView | Información del autor |

---

## ⚙️ Funcionalidades principales

- Pronósticos por ciudad con temperatura actual, mínima y máxima
- Selector de país (Chile 🇨🇱 / Argentina 🇦🇷) con carga dinámica
- Búsqueda de ciudades en tiempo real con `v-model`
- Detalle semanal con forecast de 7 días, promedio, tipo de semana y alertas
- Caché por país en `localStorage` con TTL de 6 horas (logs en consola)
- Theme de cards según hora del día (día / tarde / noche)
- Noticias desde feed RSS con caché de 3 horas
- Clima actual de capitales en el Home con navegación directa al detalle

---

## 🌐 API de clima utilizada

**Open-Meteo** — API meteorológica gratuita y sin registro.

- 📄 Documentación: [https://open-meteo.com/en/docs](https://open-meteo.com/en/docs)
- 🔗 URL base: `https://api.open-meteo.com/v1/forecast`

La app consulta todas las ciudades en **una sola petición** por país, enviando los arrays de latitudes y longitudes separados por coma:

?latitude=...&longitude=...
&current=temperature_2m,weather_code
&daily=weather_code,temperature_2m_max,temperature_2m_min
&timezone=America/Santiago

text

---

## 📊 Cálculo de estadísticas (`getForecastStats`)

Las estadísticas se calculan sobre los **próximos 7 días** del pronóstico (`forecast.slice(1, 8)`), excluyendo el día actual:

### Temperatura promedio semanal
avgTemp = Σ((maxTemp[i] + minTemp[i]) / 2) / 7

text

### Alertas automáticas

| Alerta | Condición |
|---|---|
| 🌡️ **Calor** | Al menos un día con máxima ≥ 25°C |
| 🧊 **Frío** | Al menos un día con mínima ≤ 5°C |
| 🌧️ **Semana lluviosa** | 3 o más días con códigos de lluvia (51–99) |

### Tipo de semana
Se cuentan días despejados (0–1), nublados (2–3, 45–48) y lluviosos (51–99). La categoría con más días define la etiqueta: *Semana despejada*, *Semana nublada*, *Semana lluviosa* o *Semana variada*.

---

## 🎨 Arquitectura de estilos — SCSS

Paleta principal:

| Variable | Color | Uso |
|---|---|---|
| `$color-primary` | `#4a9edd` | Botones y acentos |
| `$color-bg` | `#0a1628` | Fondo body |
| `$color-text` | `#ffffff` | Texto principal |
| `$color-text-muted` | `#a8c4e0` | Texto secundario |
| `$color-border` | `#2a5a8c` | Bordes de cards |

Themes de cards por hora del día:

| Theme | Horario | Gradiente |
|---|---|---|
| `theme-day` | 06:00 – 17:59 | Azul oscuro `#1a3a5c → #0f2744` |
| `theme-afternoon` | 18:00 – 20:59 | Naranja `#f59e0b → #9a3412` |
| `theme-night` | 21:00 – 05:59 | Noche `#1e293b → #020617` |

Convención de nombres **BEM**:
```scss
.weather-card { ... }
.weather-card__icon { ... }
.weather-card__title { ... }
🌍 Arquitectura multi-país (weatherConfig.js)
Toda la configuración de cada país vive en el objeto COUNTRIES. Agregar un país nuevo es tan simple como añadir una entrada:

js
const COUNTRIES = {
  chile: {
    label:    'Chile 🇨🇱',
    capital:  'Santiago',
    cacheKey: 'weatherCache_chile',
    timezone: 'America/Santiago',
    cities:   ['Arica', 'Iquique', ...],
    apiUrl:   'https://api.open-meteo.com/v1/forecast?...',
  },
  argentina: {
    label:    'Argentina 🇦🇷',
    capital:  'Buenos Aires',
    cacheKey: 'weatherCache_argentina',
    timezone: 'America/Argentina/Buenos_Aires',
    cities:   ['Buenos Aires', 'Córdoba', ...],
    apiUrl:   'https://api.open-meteo.com/v1/forecast?...',
  },
}
```
Caché independiente por país
País	Clave localStorage	TTL
Chile	weatherCache_chile	6 horas
Argentina	weatherCache_argentina	6 horas
Noticias	newsCache	3 horas
🏙️ Ciudades cubiertas
Chile (16 ciudades)
Arica · Iquique · Antofagasta · Copiapó · La Serena · Valparaíso · Santiago · Rancagua · Talca · Chillán · Concepción · Temuco · Valdivia · Puerto Montt · Coyhaique · Punta Arenas

Argentina (24 ciudades)
Buenos Aires · Córdoba · Rosario · Posadas · San Salvador de Jujuy · Catamarca · Formosa · Resistencia · Paraná · San Juan · San Luis · Santa Rosa · Neuquén · Rawson · Viedma · Río Gallegos · Ushuaia · Bahía Blanca · Sgo. del Estero · Tucumán · Salta · La Plata · Mendoza · La Rioja

🏃 Cómo correr el proyecto localmente
```
bash
# Clonar el repositorio
git clone https://github.com/Mackelf/weather-frontend-m2.git

# Entrar a la carpeta
cd weather-frontend-m2

# Instalar dependencias
npm install

# Correr en modo desarrollo
npm run dev
```
⚠️ No instalar en carpetas sincronizadas con Google Drive. Usar una carpeta local estándar.

👤 Autor
Mario Canto
Técnico en T.I. reconvertido a Frontend Developer.
Bootcamp Talento Digital — Módulo Frontend
GitHub: @Mackelf

📦 Dependencias externas
Open-Meteo — datos meteorológicos, sin API key

Bootstrap 5 — grilla y utilidades

Bootstrap Icons — íconos del tiempo

rss2json — conversión RSS a JSON
