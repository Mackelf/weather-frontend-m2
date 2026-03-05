# 🌤️ BootCamp Weather

Aplicación web que muestra el **clima actual y el pronóstico de 7 días** para ciudades de Chile y Argentina. Consume la API pública de Open-Meteo sin necesidad de API key, aplica caché local independiente por país, y adapta su paleta visual según la hora del día.

---

## 🏛️ Estructura de clases

### `WeatherApiClient`
Capa exclusiva de comunicación con la API. Recibe la URL completa en el constructor y expone un único método asíncrono `fetchWeatherData()`, que realiza el `fetch` y lanza un error descriptivo si la respuesta HTTP no es exitosa. Al separar esta responsabilidad, es posible reemplazar o simular el cliente (mock) sin tocar el resto de la aplicación.

### `WeatherApp`
Orquesta toda la lógica de la aplicación mediante inyección de dependencias (recibe el cliente como argumento). Sus responsabilidades son:

| Área | Métodos principales |
|---|---|
| **Caché** | `saveWeatherData()`, `loadWeatherData()` |
| **Normalización** | `normalizeLocations()` |
| **Helpers visuales** | `getCardClass()`, `getIconClass()`, `getWeather()`, `getThemeByTime()` |
| **Estadísticas** | `getForecastStats()` |
| **Renderizado** | `renderCards()`, `buildForecastHTML()`, `renderError()` |
| **Popovers** | `escapeAttr()`, `initPopovers()` |
| **Flujo principal** | `init()` |

---

## 🌐 API de clima utilizada

**Open-Meteo** — API meteorológica gratuita y sin registro.

- 📄 Documentación: [https://open-meteo.com/en/docs](https://open-meteo.com/en/docs)
- 🔗 URL base: `https://api.open-meteo.com/v1/forecast`

La app consulta las **16 ciudades en una sola petición**, enviando los arrays de latitudes y longitudes separados por coma. Los parámetros solicitados son:

```
?latitude=...&longitude=...
&current=temperature_2m,weather_code
&daily=weather_code,temperature_2m_max,temperature_2m_min
&timezone=America/Santiago
```

La respuesta es un array ordenado (un objeto por ciudad), que `normalizeLocations()` transforma asignando el nombre correcto desde `app.cities` (inyectado por `buildApp()`) según el índice.

---

## 📊 Cálculo de estadísticas (`getForecastStats`)

Las estadísticas se calculan sobre los **próximos 7 días** del pronóstico (`forecast.slice(1, 8)`), excluyendo el día actual. El método devuelve tres bloques:

### Temperatura promedio semanal
Se suma la media de máxima y mínima de cada día y se divide entre 7:
```
avgTemp = Σ((maxTemp[i] + minTemp[i]) / 2) / 7
```

### Alertas automáticas
Se generan de forma dinámica según umbrales definidos en el código:

| Alerta | Condición |
|---|---|
| 🌡️ **Calor** | Al menos un día con máxima ≥ 25 °C |
| 🧊 **Frío** | Al menos un día con mínima ≤ 5 °C |
| 🌧️ **Semana lluviosa** | 3 o más días con códigos de lluvia o tormenta (51–99) |

Cuando se activa, cada alerta muestra el valor pico (temperatura más alta o más baja registrada) o el conteo de días afectados.

### Tipo de semana
Se cuentan los días despejados (códigos 0–1), nublados (2–3, 45–48) y lluviosos (51–99). La categoría con más días gana y define la etiqueta mostrada: *Semana despejada*, *Semana nublada*, *Semana lluviosa* o *Semana variada*.

---

## 🎨 Arquitectura de estilos — SASS

Los estilos están organizados en **parciales SASS** siguiendo una estructura por capas, compilados en orden desde `main.scss`:

```
scss/
├── abstracts/
│   ├── _variables.scss   # Variables globales ($colores, $espaciado, etc.)
│   └── _mixins.scss      # Mixins reutilizables (@mixin / @include)
├── base/
│   ├── _reset.scss       # Reset/normalización de estilos del navegador
│   └── _base.scss        # Estilos tipográficos y de elementos base
├── layout/
│   └── _footer.scss      # Estructura del pie de página
├── themes/
│   └── _TimeTheme.scss   # Temas visuales según hora del día (day, afternoon, night)
└── components/
    ├── _card.scss         # Tarjetas principales de cada ciudad
    ├── _popover.scss      # Popover de pronóstico semanal
    └── _button.scss       # Botón "Detalles >"
```

### Convención de nombres — BEM

Las clases CSS siguen la convención **BEM** (`bloque__elemento--modificador`), lo que permite identificar de inmediato la relación entre componentes:

```scss
// Bloque
.weather-card { ... }

// Elemento
.weather-card__icon   { ... }
.weather-card__title  { ... }

// Modificador (estado del tiempo)
.weather-card--sunny  { ... }
.weather-card--rainy  { ... }
.weather-card--stormy { ... }

// Modificador (tema horario)
.weather-card--theme-day       { ... }
.weather-card--theme-afternoon { ... }
.weather-card--theme-night     { ... }
```

### Features de SASS utilizadas

**Nesting (anidado)** — los selectores hijos se escriben dentro del bloque padre, reflejando la jerarquía HTML sin repetir el selector raíz:
```scss
.weather-card {
  border-radius: 1rem;

  &__icon  { font-size: 2.5rem; }
  &--sunny { background: #ffe066; }
}
```

> **En progreso:** Los archivos `_variables.scss` y `_mixins.scss` están creados y son parte de la estructura, pero aún no tienen contenido implementado. La migración de valores hardcodeados a variables y la extracción de patrones repetidos a mixins está pendiente como mejora futura.

---

## 🏙️ Ciudades cubiertas

**Chile (16 ciudades)**
Arica · Iquique · Antofagasta · Copiapó · La Serena · Valparaíso · Santiago · Rancagua · Talca · Chillán · Concepción · Temuco · Valdivia · Puerto Montt · Coyhaique · Punta Arenas

**Argentina (24 ciudades)**
Buenos Aires · Córdoba · Rosario · Posadas · San Salvador de Jujuy · Catamarca · Formosa · Resistencia · Paraná · San Juan · San Luis · Santa Rosa · Neuquén · Rawson · Viedma · Río Gallegos · Ushuaia · Bahía Blanca · Sgo. del Estero · Tucumán · Salta · La Plata · Mendoza · La Rioja

> Perú y Colombia están disponibles en el dropdown como **próximamente**. Para activar un país nuevo solo hay que agregar su entrada en el objeto `COUNTRIES` de `main.js`.

---

## 🌍 Selector de país — arquitectura multi-país

El dropdown "Escoge tu País" del navbar permite cambiar entre países en tiempo real sin recargar la página. El cambio aplica un **fade out/in** sobre el grid de tarjetas mientras se resuelve la carga.

### Objeto `COUNTRIES`

Toda la configuración de cada país vive en un único objeto en `main.js`. Agregar un país nuevo es tan simple como añadir una entrada:

```js
const COUNTRIES = {
  chile: {
    label:    "Chile 🇨🇱",
    cacheKey: "weatherCache_chile",
    timezone: "America/Santiago",
    cities:   [ "Arica", "Iquique", ... ],
    apiUrl:   "https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...",
  },
  argentina: {
    label:    "Argentina 🇦🇷",
    cacheKey: "weatherCache_argentina",
    timezone: "America/Argentina/Buenos_Aires",
    cities:   [ "Buenos Aires", "Córdoba", ... ],
    apiUrl:   "https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...",
  },
};
```

### Función `buildApp(countryKey)`

En lugar de instanciar `WeatherApp` directamente, `buildApp()` la construye inyectando las ciudades y la clave de caché del país seleccionado. Esto evita modificar la clase y mantiene el principio de responsabilidad única:

```js
function buildApp(countryKey) {
  const country = COUNTRIES[countryKey];
  const app     = new WeatherApp(new WeatherApiClient(country.apiUrl), "grid");
  app.cities    = country.cities;
  app.cacheKey  = country.cacheKey;
  return app;
}
```

### Función `switchCountry(countryKey)`

Orquesta el cambio visual y de datos al seleccionar un país en el dropdown:

```
Click en dropdown
  └─ fade out del grid (opacity 0, 300ms)
  └─ buildApp(countryKey)
  └─ app.init()
        ├─ ¿Existe caché válido para este país (< 6h)?
        │     └─ SÍ → renderCards() directo
        └─ NO → fetch API → normalizar → guardar caché → renderCards()
  └─ fade in del grid (opacity 1)
```

### Caché independiente por país

Cada país escribe y lee su propio `localStorage` con una clave distinta. Cambiar de Chile a Argentina no invalida el caché chileno ni viceversa:

| País | Clave localStorage |
|---|---|
| Chile | `weatherCache_chile` |
| Argentina | `weatherCache_argentina` |
| (futuros) | `weatherCache_{countryKey}` |

---

## 🏙️ Ciudades cubiertas

## 🔗 Repositorio

[https://github.com/Mackelf/weather-frontend-m2](https://github.com/Mackelf/weather-frontend-m2)

---

## 📦 Dependencias externas

- [Open-Meteo](https://open-meteo.com/) — datos meteorológicos, sin API key
- [Bootstrap 5](https://getbootstrap.com/) — grid y componente Popover
- [Bootstrap Icons](https://icons.getbootstrap.com/) — íconos del tiempo
