<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { COUNTRIES, localeMap } from '@/utils/weatherConfig'
import {
  getWeather,
  normalizeLocations,
  loadWeatherData,
  saveWeatherData,
  getForecastStats,
} from '@/utils/weatherHelpers'

const route = useRoute()
const router = useRouter()

const countryKey = computed(() => route.params.country)
const cityName = computed(() => route.params.city)

const isLoading = ref(true)
const error = ref(null)
const selectedLugar = ref(null)

const currentStats = computed(() => {
  if (!selectedLugar.value || !selectedLugar.value.forecast) {
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
  return getForecastStats(selectedLugar.value.forecast)
})

async function loadDetail() {
  try {
    isLoading.value = true
    error.value = null

    const key = countryKey.value
    const cfg = COUNTRIES[key]
    if (!cfg) throw new Error('País no soportado')

    let data = loadWeatherData(key)
    if (!data) {
      const resp = await fetch(cfg.apiUrl)
      if (!resp.ok) {
        throw new Error(`Error HTTP: ${resp.status} ${resp.statusText}`)
      }
      const raw = await resp.json()
      const locations = Array.isArray(raw) ? raw : [raw]
      data = normalizeLocations(locations, key)
      saveWeatherData(key, data)
    }

    const ciudad = decodeURIComponent(cityName.value)
    const lugar = data.find((l) => l.city === ciudad)
    if (!lugar) throw new Error('No se encontró el lugar en los datos')

    selectedLugar.value = lugar
  } catch (e) {
    console.error(e)
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}

function goBack() {
  router.back()
}

onMounted(loadDetail)
</script>

<template>
  <section class="container py-4">
    <button class="btn btn-link mb-3" @click="goBack">
      ← Volver a pronósticos
    </button>

    <h2>Detalle del clima</h2>

    <p class="text-muted mb-3">
      País: {{ countryKey }} · Ciudad: {{ cityName }}
    </p>

    <div v-if="isLoading">
      Cargando detalles del clima...
    </div>

    <div v-else-if="error" class="text-danger">
      {{ error }}
    </div>

    <div v-else-if="selectedLugar">
      <p>
        Temperatura actual:
        <strong>{{ selectedLugar.temp.toFixed(1) }}°C</strong>
      </p>
      <p>
        Mínima: {{ selectedLugar.minTemp.toFixed(1) }}°C · Máxima:
        {{ selectedLugar.maxTemp.toFixed(1) }}°C
      </p>
      <p>Condición: {{ getWeather(selectedLugar.code).label }}</p>

      <hr />

      <div v-if="selectedLugar.forecast?.length">
        <!-- Stats -->
        <div class="d-flex flex-column gap-2 mb-3">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-thermometer-half"></i>
            <span>
              Promedio semanal:
              <strong>{{ currentStats.avgTemp }}°C</strong>
            </span>
          </div>

          <div
            class="d-flex align-items-center gap-2"
            :class="currentStats.weekType.css"
          >
            <i :class="currentStats.weekType.icon"></i>
            <span>{{ currentStats.weekType.label }}</span>
          </div>
        </div>

        <!-- Alertas -->
        <div class="mb-3">
          <div
            v-for="alert in currentStats.alerts"
            :key="alert.text"
            class="d-flex align-items-center gap-2 mb-1"
          >
            <i :class="alert.icon"></i>
            <span>{{ alert.text }}</span>
          </div>
        </div>

        <!-- Próximos 7 días -->
        <div class="row row-cols-2 row-cols-md-4 g-2">
          <div
            v-for="day in selectedLugar.forecast.slice(1, 8)"
            :key="day.date"
            class="col"
          >
            <div class="border rounded p-2 small h-100">
              <div class="fw-semibold">
                {{
                  new Date(day.date + 'T12:00:00').toLocaleDateString(
                    localeMap[countryKey] ?? 'es-CL',
                    {
                      weekday: 'short',
                      day: '2-digit',
                    }
                  )
                }}
              </div>
              <div>{{ getWeather(day.code).label }}</div>
              <div>↑ {{ day.maxTemp.toFixed(1) }}°C</div>
              <div>↓ {{ day.minTemp.toFixed(1) }}°C</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
