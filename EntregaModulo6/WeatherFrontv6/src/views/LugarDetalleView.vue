<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { COUNTRIES, localeMap } from '@/utils/weatherConfig'
import {
  getWeather,
  getIconClass,
  normalizeLocations,
  loadWeatherData,
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
  if (!selectedLugar.value?.forecast) {
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
      if (!resp.ok) throw new Error(`Error HTTP: ${resp.status} ${resp.statusText}`)
      const raw = await resp.json()
      const locations = Array.isArray(raw) ? raw : [raw]
      data = normalizeLocations(locations, key)
      
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

    <!-- Volver -->
    <button class="btn-back mb-4" @click="goBack">
      ← Volver
    </button>

    <div v-if="isLoading" class="detail-muted">Cargando detalles del clima...</div>
    <div v-else-if="error" class="text-danger">{{ error }}</div>

    <div v-else-if="selectedLugar">

      <!-- Header ciudad -->
      <div class="detail-card mb-4">
        <div class="detail-muted small mb-1 text-uppercase">{{ countryKey }}</div>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h2 class="mb-1">{{ cityName }}</h2>
            <div class="detail-muted">{{ getWeather(selectedLugar.code).label }}</div>
          </div>
          <i
            :class="getIconClass(selectedLugar.code)"
            style="font-size: 3.5rem; color: #4a9edd"
          ></i>
        </div>

        <div class="d-flex align-items-baseline gap-2 mt-3">
          <span style="font-size: 3rem; font-weight: 700; line-height: 1">
            {{ selectedLugar.temp.toFixed(1) }}°C
          </span>
        </div>

        <div class="d-flex gap-3 mt-2 detail-muted small">
          <span>↓ {{ selectedLugar.minTemp.toFixed(1) }}°C</span>
          <span>↑ {{ selectedLugar.maxTemp.toFixed(1) }}°C</span>
        </div>
      </div>

      <div v-if="selectedLugar.forecast?.length">

        <!-- Stats -->
        <div class="detail-card mb-4">
          <h3 class="detail-section-title mb-3">Resumen semanal</h3>

          <div class="d-flex align-items-center gap-2 mb-2">
            <i class="bi bi-thermometer-half" style="color: #4a9edd"></i>
            <span class="detail-muted">
              Promedio semanal:
              <strong style="color: #ffffff">{{ currentStats.avgTemp }}°C</strong>
            </span>
          </div>

          <div class="d-flex align-items-center gap-2 mb-3">
            <i :class="currentStats.weekType.icon" style="color: #4a9edd"></i>
            <span class="detail-muted">{{ currentStats.weekType.label }}</span>
          </div>

          <!-- Alertas -->
          <div
            v-for="alert in currentStats.alerts"
            :key="alert.text"
            class="detail-alert mb-2"
          >
            <i :class="alert.icon"></i>
            <span>{{ alert.text }}</span>
          </div>
        </div>

        <!-- Forecast 7 días -->
        <div class="detail-card">
          <h3 class="detail-section-title mb-3">Próximos 7 días</h3>
          <div class="row row-cols-2 row-cols-md-4 g-2">
            <div
              v-for="day in selectedLugar.forecast.slice(1, 8)"
              :key="day.date"
              class="col"
            >
              <div class="forecast-day">
                <div class="forecast-day__date">
                  {{
                    new Date(day.date + 'T12:00:00').toLocaleDateString(
                      localeMap[countryKey] ?? 'es-CL',
                      { weekday: 'short', day: '2-digit' }
                    )
                  }}
                </div>
                <i
                  :class="getIconClass(day.code)"
                  class="forecast-day__icon"
                ></i>
                <div class="forecast-day__desc">{{ getWeather(day.code).label }}</div>
                <div class="forecast-day__temp">↑ {{ day.maxTemp.toFixed(1) }}°C</div>
                <div class="forecast-day__temp forecast-day__temp--min">
                  ↓ {{ day.minTemp.toFixed(1) }}°C
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.btn-back {
  background: transparent;
  border: none;
  color: #4a9edd;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #a8c4e0;
  }
}

.detail-card {
  background: linear-gradient(180deg, #1a3a5c 0%, #0f2744 100%);
  border: 1px solid #2a5a8c;
  border-radius: 0.75rem;
  padding: 1.5rem;
  color: #ffffff;
}

.detail-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #a8c4e0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.detail-muted {
  color: #a8c4e0;
}

.detail-alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(74, 158, 221, 0.15);
  border: 1px solid #2a5a8c;
  border-radius: 0.5rem;
  padding: 0.4rem 0.75rem;
  font-size: 0.875rem;
  color: #a8c4e0;

  i {
    color: #4a9edd;
  }
}

.forecast-day {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #2a5a8c;
  border-radius: 0.5rem;
  padding: 0.75rem;
  text-align: center;
  height: 100%;

  &__date {
    font-size: 0.8rem;
    font-weight: 600;
    color: #a8c4e0;
    text-transform: capitalize;
    margin-bottom: 0.4rem;
  }

  &__icon {
    font-size: 1.5rem;
    color: #4a9edd;
    display: block;
    margin-bottom: 0.3rem;
  }

  &__desc {
    font-size: 0.75rem;
    color: #a8c4e0;
    margin-bottom: 0.4rem;
  }

  &__temp {
    font-size: 0.85rem;
    font-weight: 600;
    color: #ffffff;

    &--min {
      color: #a8c4e0;
      font-weight: 400;
    }
  }
}
</style>
