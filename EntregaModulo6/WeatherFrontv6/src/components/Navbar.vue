<script setup>
import { RouterLink } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.min.css'
</script>

<template>
  <header>
    <h1><i class="bi bi-cloud-sun"></i>BootCamp Weather</h1>

    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div class="container-fluid">
        <RouterLink class="navbar-brand" to="/">HOME</RouterLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink class="nav-link" aria-current="page" to="/pronosticos">
                Pronosticos
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/news">
                Noticias y Blog
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/about">
                Quienes somos
              </RouterLink>
            </li>
              
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>
<style scoped>
header {
  padding: 0.75rem 1rem 0;
}

header h1 {
  color: #ffffff;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

header h1 i {
  margin-right: 0.4rem;
}
</style>
