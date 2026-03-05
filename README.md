# 🌤️ WeatherApp Chile — Documentación técnica

Aplicación web que muestra el clima actual y el pronóstico de 7 días para 16 ciudades de Chile, usando la API pública de Open-Meteo.

---

## Arquitectura general

El código está dividido en dos clases con responsabilidades separadas:

**`WeatherApiClient`** — solo se comunica con la API. Recibe la URL en el constructor y expone un único método `fetchWeatherData()`. Si en el futuro se cambia la fuente de datos, solo se toca esta clase.

**`WeatherApp`** — orquesta todo lo demás: caché, normalización de datos, renderizado de tarjetas y popovers. Recibe el cliente como dependencia en el constructor (*inyección de dependencias*), lo que facilita el testing con clientes falsos (mocks).

---

## Flujo principal

```
app.init()
  │
  ├─ loadWeatherData()
  │     ├─ ¿Existe caché válido (< 6h)?
  │     │     └─ SÍ → this.lugares = cached → renderCards()
  │     └─ NO ↓
  │
  ├─ apiClient.fetchWeatherData()   ← llama a Open-Meteo
  │
  ├─ normalizeLocations()           ← transforma la respuesta cruda
  │
  ├─ saveWeatherData()              ← guarda en localStorage con timestamp
  │
  └─ renderCards()                  ← dibuja las tarjetas en el DOM
```

---

## Caché (localStorage)

Para evitar llamadas innecesarias a la API, los datos se guardan en `localStorage` con un TTL de **6 horas**.

| Clave | Valor |
|-------|-------|
| `weatherCache` | `{ timestamp, data[] }` |

- Si los datos tienen menos de 6 horas, se usan directamente sin llamar a la API.
- Si expiraron o no existen, se hace un fetch completo y se vuelve a guardar.

---

## Datos normalizados por ciudad

Cada ciudad queda representada como un objeto con esta forma:

```javascript
{
  city:    "Santiago",
  temp:    22,               // temperatura actual en °C
  code:    1,                // código WMO del estado del cielo
  maxTemp: 27,               // máxima del día actual
  minTemp: 14,               // mínima del día actual
  forecast: [                // array de 8 días (índice 0 = hoy)
    { date: "2026-03-05", code: 1, maxTemp: 27, minTemp: 14 },
    { date: "2026-03-06", code: 2, maxTemp: 25, minTemp: 13 },
    // ...7 días más
  ]
}
```

---

## Códigos WMO

El objeto `WEATHER_CODES` mapea cada código numérico de la API a una etiqueta en español y un emoji. Cubre desde cielo despejado (0) hasta tormentas con granizo intenso (99).

Los helpers visuales traducen el código en clases CSS y clases de ícono de Bootstrap Icons:

- `getCardClass(code)` → clase de color de fondo de la tarjeta (`weather-card--sunny`, `--rain`, `--stormy`, etc.)
- `getIconClass(code)` → clase de ícono Bootstrap (`bi-sun-fill`, `bi-cloud-rain-fill`, etc.)
- `getWeather(code)`   → `{ label, emoji }` para mostrar en texto

---

## Tema visual por hora del día

`getThemeByTime()` devuelve una clase CSS que se aplica tanto al `<body>` como a cada tarjeta, cambiando la paleta de colores según el momento del día:

| Horario | Clase |
|---------|-------|
| 06:00 – 17:59 | `theme-day` |
| 18:00 – 20:59 | `theme-afternoon` |
| 21:00 – 05:59 | `theme-night` |

---

## Tarjetas principales — `renderCards()`

Por cada ciudad se genera una card Bootstrap con:

- Nombre de la ciudad y fecha actual
- Ícono del estado del cielo
- Temperatura actual
- Descripción del tiempo
- Mínima y máxima del día
- Botón **"Detalles >"** que abre el popover de pronóstico

---

## Popover de pronóstico — 7 días

Al hacer clic en "Detalles >", Bootstrap muestra un popover con las tarjetas de los 7 días siguientes (excluyendo el día actual, que ya está en la card principal).

El proceso involucra tres métodos:

**`buildForecastHTML(forecast)`** — construye el HTML interno del popover mapeando `forecast.slice(1, 8)`. Cada día muestra: fecha abreviada, ícono, descripción, máxima y mínima.

**`escapeAttr(html)`** — sanitiza el HTML antes de inyectarlo en el atributo `data-bs-content=""`. Escapa `&`, `"`, `'` y colapsa espacios y saltos de línea para que el atributo sea válido.

**`initPopovers()`** — inicializa todos los popovers con `new bootstrap.Popover()` e instala un listener global para cerrarlos al hacer clic fuera de ellos.

```
Click "Detalles >"
  └─ Bootstrap lee data-bs-content (HTML escapado)
  └─ Desescapa y renderiza el HTML dentro del popover
  └─ Muestra 7 tarjetas horizontales con scroll
  └─ Click fuera → initPopovers() listener → pop.hide()
```

---

## API — Open-Meteo

Se consultan las 16 ciudades en una sola petición pasando coordenadas separadas por coma:

```
GET https://api.open-meteo.com/v1/forecast
  ?latitude=...16 valores...
  &longitude=...16 valores...
  &current=temperature_2m,weather_code
  &daily=time,weather_code,temperature_2m_max,temperature_2m_min
  &timezone=America/Santiago
```

La API devuelve un array de objetos, uno por ciudad, en el mismo orden que las coordenadas. `normalizeLocations()` usa ese índice para asignar el nombre correcto desde `WeatherApp.CITIES`.

---

## Ciudades cubiertas

Arica · Iquique · Antofagasta · Copiapó · La Serena · Valparaíso · Santiago · Rancagua · Talca · Chillán · Concepción · Temuco · Valdivia · Puerto Montt · Coyhaique · Punta Arenas

---

## Dependencias externas

- [Open-Meteo API](https://open-meteo.com/) — datos meteorológicos, sin API key
- [Bootstrap 5](https://getbootstrap.com/) — grid, componente Popover
- [Bootstrap Icons](https://icons.getbootstrap.com/) — íconos del tiempo
