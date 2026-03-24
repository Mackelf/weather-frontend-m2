<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { COUNTRIES } from '@/utils/weatherConfig'
import {
  getWeather,
  getIconClass,
  normalizeLocations,
  loadWeatherData,
} from '@/utils/weatherHelpers'

const router = useRouter()

const capitales = ref([])
const isLoading = ref(true)
const error = ref(null)

const today = new Date().toLocaleDateString('es-CL', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
})

async function loadCapital(countryKey) {
  try {
    const cfg = COUNTRIES[countryKey]
    if (!cfg) return null

    let data = loadWeatherData(countryKey)
    if (!data) {
      const resp = await fetch(cfg.apiUrl)
      if (!resp.ok) throw new Error(`Error HTTP: ${resp.status}`)
      const raw = await resp.json()
      const locations = Array.isArray(raw) ? raw : [raw]
      data = normalizeLocations(locations, countryKey)
    }

    const capital = data.find((l) => l.city === cfg.capital)
    if (!capital) return null

    // construir iconClass y description siempre desde el code
    // por si el caché viene de PronosticosView (tiene iconClass)
    // o de normalizeLocations (solo tiene code)
    const iconClass = capital.iconClass ?? getIconClass(capital.code)
    const description = capital.description ?? getWeather(capital.code)?.label ?? ''

    return {
      countryKey,
      countryLabel: cfg.label,
      city: capital.city,
      temp: capital.temp,
      minTemp: capital.minTemp,
      maxTemp: capital.maxTemp,
      description,
      iconClass,
    }
  } catch (e) {
    console.error(`[Home] Error cargando capital de ${countryKey}:`, e)
    return null
  }
}

async function loadAllCapitales() {
  try {
    isLoading.value = true
    error.value = null
    const results = await Promise.all(Object.keys(COUNTRIES).map((key) => loadCapital(key)))
    capitales.value = results.filter((r) => r !== null)
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}

function goToPronosticos(countryKey) {
  router.push({ name: 'pronosticos', query: { country: countryKey } })
}

function goToDetalle(capital) {
  router.push({
    name: 'lugar-detalle',
    params: { country: capital.countryKey, city: capital.city },
  })
}

onMounted(loadAllCapitales)
</script>

<template>
  <section class="container py-4">
    <!-- Hero -->
    <header class="mb-4">
      <h2 class="mb-2">Bienvenido a BootCamp Weather</h2>
      <p class="home-muted mb-0">
        Tu fuente confiable para pronósticos del tiempo en América Latina. Escoge tu país y mantente
        informado sobre las condiciones climáticas actuales y futuras.
      </p>
      <p class="home-muted small mt-1">Hoy es {{ today }}.</p>
    </header>

    <!-- Capitales -->
    <div class="mb-4">
      <h3 class="h5 mb-3">Clima actual en capitales</h3>

      <div v-if="isLoading" class="home-muted">Cargando clima de capitales...</div>
      <div v-else-if="error" class="text-danger">{{ error }}</div>

      <div v-else class="row g-3">
        <div v-for="capital in capitales" :key="capital.countryKey" class="col-sm-6 col-md-4">
          <div class="home-card h-100" style="display: flex; flex-direction: column; gap: 10px">
            <!-- Header: país + ícono alineados en extremos -->
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <div class="home-muted small">{{ capital.countryLabel }}</div>
                <div class="fw-bold fs-5">{{ capital.city }}</div>
              </div>
              <i
                :class="capital.iconClass"
                style="font-size: 2.5rem; color: #4a9edd; flex-shrink: 0"
              ></i>
            </div>

            <!-- Temperatura grande + descripción inline -->
            <div class="d-flex align-items-baseline gap-2">
              <div style="font-size: 2.25rem; font-weight: 700; line-height: 1">
                {{ capital.temp.toFixed(1) }}°
              </div>
              <div class="home-muted small">C · {{ capital.description }}</div>
            </div>

            <!-- Botones a ancho completo -->
            <div class="d-flex gap-2 mt-auto">
              <button class="btn-home-primary flex-fill" @click="goToDetalle(capital)">
                Ver detalle
              </button>
              <button
                class="btn-home-secondary flex-fill"
                @click="goToPronosticos(capital.countryKey)"
              >
                Ver pronósticos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Info y accesos -->
    <div class="row g-3">
      <div class="col-md-6">
        <div class="home-card h-100">
          <h2 class="h5 mb-2">Pronósticos por ciudad</h2>
          <p class="home-muted">
            Revisa las condiciones climáticas actuales y futuras para ciudades de Chile y Argentina.
          </p>
          <button class="btn-home-primary" @click="router.push('/pronosticos')">
            Ver pronósticos
          </button>
        </div>
      </div>

      <div class="col-md-6">
        <div class="home-card h-100">
          <h2 class="h5 mb-2">Noticias y blog</h2>
          <p class="home-muted">Artículos y novedades sobre el clima en América Latina.</p>
          <button class="btn-home-secondary" @click="router.push('/news')">Ir a noticias</button>
        </div>
      </div>

      <div class="col-12">
        <div class="home-card">
          <h2 class="h5 mb-2">¿Cómo usar esta app?</h2>
          <ul class="home-muted mb-0">
            <li>En "Pronósticos" elige el país y filtra por ciudad.</li>
            <li>Haz clic en "Detalles" para ver el pronóstico de 7 días.</li>
            <li>Usa la barra de búsqueda para encontrar ciudades rápido.</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.home-card {
  background: linear-gradient(180deg, #1a3a5c 0%, #0f2744 100%);
  border: 1px solid #2a5a8c;
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
  color: #ffffff;
  display: flex;
  flex-direction: column;
}

.home-muted {
  color: #a8c4e0;
}

.btn-home-primary {
  background: transparent;
  border: 1px solid #4a9edd;
  color: #4a9edd;
  border-radius: 0.4rem;
  padding: 0.3rem 0.8rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #4a9edd;
    color: #ffffff;
  }
}

.btn-home-secondary {
  background: transparent;
  border: 1px solid #a8c4e0;
  color: #a8c4e0;
  border-radius: 0.4rem;
  padding: 0.3rem 0.8rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #a8c4e0;
    color: #0a1628;
  }
}
</style>
