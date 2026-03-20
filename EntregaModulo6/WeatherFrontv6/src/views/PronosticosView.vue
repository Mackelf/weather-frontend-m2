<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import WeatherCard from '../components/WeatherCard.vue'
import { COUNTRIES, localeMap } from '@/utils/weatherConfig'
import {
  getWeather,
  getIconClass,
  normalizeLocations,
  loadWeatherData,
  saveWeatherData,
} from '@/utils/weatherHelpers'

const router = useRouter()

//logica de busqueda
const searchTerm = ref('')
const hasResults = computed(() => filteredLugares.value.length > 0)

const filteredLugares = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) 
  return lugares.value
  
  return lugares.value.filter((lugar) =>
    lugar.city.toLowerCase().includes(term)
  )
})




const currentCountry = ref('chile')
const lugares = ref([])
const isLoading = ref(true)
const error = ref(null)

const currentConfig = computed(() => COUNTRIES[currentCountry.value])

async function loadData() {
  try {
    isLoading.value = true
    error.value = null

    let data = loadWeatherData(currentCountry.value)
    if (!data) {
      const cfg = currentConfig.value
      if (!cfg) {
        throw new Error('País no soportado')
      }

      const resp = await fetch(cfg.apiUrl)
      if (!resp.ok) {
        throw new Error(`Error HTTP: ${resp.status} ${resp.statusText}`)
      }

      const raw = await resp.json()
      const locations = Array.isArray(raw) ? raw : [raw]
      const normalizados = normalizeLocations(locations, currentCountry.value)

      const locale = localeMap[currentCountry.value] ?? 'es-CL'
      const todayLabel = new Date()
        .toLocaleDateString(locale, {
          day: '2-digit',
          month: 'short',
        })
        .toUpperCase()

      data = normalizados.map((loc) => {
        const wx = getWeather(loc.code)
        const iconClass = getIconClass(loc.code)
        return {
          city: loc.city,
          description: wx.label.toUpperCase(),
          temp: loc.temp,
          minTemp: loc.minTemp,
          maxTemp: loc.maxTemp,
          iconClass,
          dateLabel: todayLabel,
          theme: 'theme-day', // o tu getThemeByTime() si lo quieres reutilizar
          forecast: loc.forecast,
        }
      })

      saveWeatherData(currentCountry.value, data)
    }

    lugares.value = data
  } catch (e) {
    console.error(e)
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}

onMounted(loadData)

watch(currentCountry, () => {
  lugares.value = []
  loadData()
})

function openDetails(lugar) {
  router.push({
    name: 'lugar-detalle',
    params: {
      country: currentCountry.value,
      city: lugar.city,
    },
  })
}
</script>

<template>
  <section class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-0">Pronósticos destacados</h2>

      <div class="d-flex gap-2">
        <input
          v-model="searchTerm"
          type="text"
          class="form-control form-control-sm"
          placeholder="Buscar ciudad..."
          style="max-width: 200px;"

        />
      </div>

      <select
        v-model="currentCountry"
        class="form-select form-select-sm"
        style="max-width: 240px"
      >
        <option
          v-for="(cfg, key) in COUNTRIES"
          :key="key"
          :value="key"
        >
          📍 {{ cfg.label }}
        </option>
      </select>
    </div>

    <div v-if="isLoading">Cargando pronósticos...</div>

    <div v-else-if="error" class="text-danger">
      {{ error }}
    </div>

    <div v-else>
      <div v-if="hasResults">
      <div class="row">
        <div
          v-for="lugar in filteredLugares"
          :key="lugar.city"
          class="col-sm-6 col-lg-3 d-flex justify-content-center mb-4"
        >
          <WeatherCard
            :city="lugar.city"
            :date-label="lugar.dateLabel"
            :description="lugar.description"
            :temperature="lugar.temp"
            :min-temp="lugar.minTemp"
            :max-temp="lugar.maxTemp"
            :icon-class="lugar.iconClass"
            :theme="lugar.theme"
            @show-details="openDetails(lugar)"
          />
        </div>
      </div>
      </div>
      <div v-else class="text-muted">
        No se encontraron resultados para "{{ searchTerm }}"
      </div>
    </div>
  </section>
</template>
