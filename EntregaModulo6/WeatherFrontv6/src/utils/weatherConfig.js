// src/utils/weatherConfig.js

export const COUNTRIES = {
  chile: {
    label: 'Chile 🇨🇱',
    capital: 'Santiago',
    cacheKey: 'weatherCache_chile',
    timezone: 'America/Santiago',
    cities: [
      'Arica',
      'Iquique',
      'Antofagasta',
      'Copiapo',
      'La Serena',
      'Valparaiso',
      'Santiago',
      'Rancagua',
      'Talca',
      'Chillán',
      'Concepción',
      'Temuco',
      'Valdivia',
      'Puerto Montt',
      'Coyhaique',
      'Punta Arenas',
    ],
    apiUrl:
      'https://api.open-meteo.com/v1/forecast' +
      '?latitude=-18.4746,-20.2133,-23.6509,-27.3668,-29.9027,-33.0472,-33.4489,-34.1708,-35.4264,-36.0667,-36.8270,-38.7359,-39.8142,-41.4693,-45.5752,-53.1638' +
      '&longitude=-70.2979,-70.1503,-70.3975,-70.3322,-71.2519,-71.6127,-70.6693,-70.7444,-71.6554,-71.9167,-73.0498,-72.5904,-73.2459,-72.9411,-72.0662,-70.9171' +
      '&current=temperature_2m,weather_code' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min' +
      '&timezone=America/Santiago',
  },

  argentina: {
    label: 'Argentina 🇦🇷',
    capital: 'Buenos Aires',
    cacheKey: 'weatherCache_argentina',
    timezone: 'America/Argentina/Buenos_Aires',
    cities: [
      'Buenos Aires',
      'Córdoba',
      'Rosario',
      'Posadas',
      'San Salvador de Jujuy',
      'Catamarca',
      'Formosa',
      'Resistencia',
      'Paraná',
      'San Juan',
      'San Luis',
      'Santa Rosa',
      'Neuquén',
      'Rawson',
      'Viedma',
      'Río Gallegos',
      'Ushuaia',
      'Bahía Blanca',
      'Sgo. del Estero',
      'Tucumán',
      'Salta',
      'La Plata',
      'Mendoza',
      'La Rioja',
    ],
    apiUrl:
      'https://api.open-meteo.com/v1/forecast' +
      '?latitude=-34.6132,-31.4135,-32.9468,-27.3671,-24.1858,-28.4696,-26.1849,-27.4606,-31.7333,-31.5375,-33.3017,-32.4847,-36.6167,-38.9516,-43.3002,-40.8135,-45.8641,-54.8019,-38.7196,-27.8006,-26.8241,-24.7859,-34.9215,-33.2950' +
      '&longitude=-58.3772,-64.1811,-60.6393,-55.8961,-65.2995,-65.7852,-58.1731,-58.9839,-60.5298,-68.5364,-66.3378,-58.2321,-64.2833,-68.0591,-65.1023,-62.9967,-67.4808,-68.3030,-62.2724,-64.2615,-65.2226,-65.4117,-57.9545,-66.3356' +
      '&current=temperature_2m,weather_code' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min' +
      '&timezone=America/Argentina/Buenos_Aires',
  },

  // aquí luego agregas más países
}

export const localeMap = {
  chile: 'es-CL',
  argentina: 'es-AR',
  // peru: 'es-PE',
  // brasil: 'pt-BR',
}

export const CACHE_TTL_MS = 6 * 60 * 60 * 1000
