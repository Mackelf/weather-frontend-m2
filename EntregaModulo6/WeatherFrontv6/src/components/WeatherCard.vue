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
      <span class="small text-uppercase">{{ city }}</span>
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
.weather-card {
  max-width: 320px;
  width: 100%;
  min-height: 260px;
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem 1.5rem;
  color: #f9fafb;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;

  .card-header {
    background: transparent;
    border: none;
    padding: 0;
  }

  .weather-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.7);
  }

  .weather-main {
    margin-top: 0.75rem;

    &__icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
  }

  .temp-now {
    font-size: 2rem;
    font-weight: 700;

    span {
      font-size: 1.2rem;
      margin-left: 2px;
    }
  }

  .weather-desc {
    margin-top: 0.25rem;
    font-size: 0.9rem;
    letter-spacing: 0.08em;
  }

  .btn-detalles {
    align-self: flex-end;
    font-size: 0.8rem;
    padding-inline: 0;
    color: rgba(255, 255, 255, 0.8);
  }
}
</style>
