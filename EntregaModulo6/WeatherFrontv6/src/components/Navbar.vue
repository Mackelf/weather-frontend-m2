<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header>
    <h1><i class="bi bi-cloud-sun"></i>BootCamp Weather</h1>

    <nav class="navbar navbar-expand-lg bg-body-tertiary">
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
              <a class="nav-link disabled" href="#">Quienes somos</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>
