<script setup>
// sin lógica, vista estática
</script>

<template>
  <section class="container py-4">

    <div class="about-card mb-4">
      <div class="d-flex align-items-center gap-3 mb-4">
        <i class="bi bi-person-circle" style="font-size: 3rem; color: #4a9edd"></i>
        <div>
          <h2 class="mb-0">Mario Canto</h2>
          <div class="about-muted">Frontend Developer en formación</div>
        </div>
      </div>

      <p class="about-text">
        Este proyecto es para portfolio, evidencia de lo aprendido en un curso de Sence,
        un Bootcamp por Talento Digital.
      </p>

      <p class="about-text">
        La mayor parte de mi vida profesional la he ejercido en el área de T.I. Hice soporte
        en terreno, diagnosticando y reparando PC, desktop, notebook y periféricos. También
        resolviendo problemas de software; en fin, cada aspecto en donde un cliente necesite
        continuidad operativa.
      </p>

      <p class="about-text">
        Ahora tengo la oportunidad de crecer en el área como Developer Frontend, algo que me
        ha atraído bastante. Espero que este y otros proyectos que comparta sean reflejo de
        lo que podría hacer profesionalmente en un futuro cercano.
      </p>
    </div>

    <!-- Stack / habilidades -->
    <div class="about-card">
      <h3 class="about-section-title mb-3">Stack aprendido en el Bootcamp</h3>
      <div class="d-flex flex-wrap gap-2">
        <span class="about-tag">HTML5</span>
        <span class="about-tag">CSS3</span>
        <span class="about-tag">SCSS</span>
        <span class="about-tag">JavaScript</span>
        <span class="about-tag">Vue.js 3</span>
        <span class="about-tag">Vue Router</span>
        <span class="about-tag">Bootstrap 5</span>
        <span class="about-tag">Git / GitHub</span>
        <span class="about-tag">REST APIs</span>
        <span class="about-tag">Vite</span>
      </div>
    </div>

  </section>
</template>

<style scoped lang="scss">
.about-card {
  background: linear-gradient(180deg, #1a3a5c 0%, #0f2744 100%);
  border: 1px solid #2a5a8c;
  border-radius: 0.75rem;
  padding: 1.75rem;
  color: #ffffff;
}

.about-muted {
  color: #a8c4e0;
  font-size: 0.9rem;
}

.about-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #a8c4e0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.about-text {
  color: #d0e8f5;
  line-height: 1.7;
  margin-bottom: 1rem;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.about-tag {
  background: rgba(74, 158, 221, 0.15);
  border: 1px solid #2a5a8c;
  border-radius: 0.4rem;
  padding: 0.25rem 0.7rem;
  font-size: 0.8rem;
  color: #4a9edd;
}
</style>
