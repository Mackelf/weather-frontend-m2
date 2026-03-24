<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'

import { onMounted } from 'vue'



</script>

<template>
  <header>
    <Navbar />
  </header>

  <main>
    <RouterView />
  </main>

  <footer class="py-3 bg-light">
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
