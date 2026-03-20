<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'

import { onMounted } from 'vue'

onMounted(() => {
  const hour = new Date().getHours()
  let theme = 'theme-night'

  if (hour >= 6 && hour < 18) {
    theme = 'theme-day'
  } else if (hour >= 18 && hour < 21) {
    theme = 'theme-afternoon'
  }
  document.body.className = theme  
  }
)

</script>

<template>
  <header>
    <Navbar />
  </header>

  <main>
    <RouterView />
  </main>

  <footer class="py-3">
    <div class="container text-center">
      <span class="text-muted">
        &copy; 2026 Bootcamp Weather. Web con resumen semanal del clima en
        Chile. All rights reserved. Mario Canto.
      </span>
    </div>
  </footer>
 
</template>

<style scoped>
/* estilos globales del layout si los necesitas */
</style>
