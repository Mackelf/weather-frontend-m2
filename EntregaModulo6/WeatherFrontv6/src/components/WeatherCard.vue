<script setup>
const props = defineProps({
  city: { type: String, required: true },
  dateLabel: { type: String, required: true },      // 18-MAR
  description: { type: String, required: true },    // DESPEJADO
  temperature: { type: Number, required: true },    // temp actual
  minTemp: { type: Number, required: true },
  maxTemp: { type: Number, required: true },
  iconClass: { type: String, required: true },      // bi bi-sun-fill
  theme: { type: String, default: 'theme-day' },
  
})

const emit = defineEmits(['show-details'])

function onShowDetails() {
  emit('show-details')
}
</script>

<template>
  <article class="card weather-card" :class="theme">
    <div class="card-header d-flex justify-content-between align-items-center">
      <span class="weather-dot"></span>
      <span class="text-uppercase">{{ city }}</span>
      <span class="small text-uppercase">{{ dateLabel }}</span>
    </div>

    <hr class="my-2" />

    <div class="weather-main text-center">
      <i :class="['weather-main__icon', iconClass]"></i>
      <div class="temp-now">
        {{ temperature.toFixed(1) }}<span>°C</span>
      </div>
      <div class="weather-desc text-uppercase">
        {{ description }}
      </div>
    </div>

    <div class="temp-range d-flex justify-content-between mt-2 small">
      <span class="temp-min">↓ {{ minTemp.toFixed(1) }}°C</span>
      <span class="temp-max">↑ {{ maxTemp.toFixed(1) }}°C</span>
    </div>

    <button class="btn btn-detalles mt-3" @click="onShowDetails"
    >
      Detalles &gt;
    </button>
  </article>
</template>

<style scoped lang="scss">

</style>
