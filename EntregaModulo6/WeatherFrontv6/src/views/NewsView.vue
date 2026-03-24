<script setup>
import { ref, onMounted } from 'vue'

const RSS_URL = 'https://politepaul.com/fd/l5puGTIWurit.xml'
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${RSS_URL}`
const CACHE_KEY = 'newsCache'
const CACHE_TTL_MS = 3 * 60 * 60 * 1000

const noticias = ref([])
const feedTitle = ref('')
const isLoading = ref(true)
const error = ref(null)

function loadFromCache() {
  const raw = localStorage.getItem(CACHE_KEY)
  if (!raw) return null
  try {
    const { timestamp, data } = JSON.parse(raw)
    if (Date.now() - timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY)
      console.log('[Cache][news] Expirado. Refrescando...')
      return null
    }
    console.log('[Cache][news] Usando caché.')
    return data
  } catch {
    localStorage.removeItem(CACHE_KEY)
    return null
  }
}

function saveToCache(data) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ timestamp: Date.now(), data })
  )
  console.log('[Cache][news] Guardado:', new Date().toLocaleTimeString())
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function stripHtml(str) {
  return str.replace(/<[^>]*>/g, '').trim()
}

async function loadNoticias() {
  try {
    isLoading.value = true
    error.value = null

    const cached = loadFromCache()
    if (cached) {
      noticias.value = cached.items
      feedTitle.value = cached.feedTitle
      return
    }

    const resp = await fetch(API_URL)
    if (!resp.ok) throw new Error(`Error HTTP: ${resp.status}`)

    const json = await resp.json()
    if (json.status !== 'ok') throw new Error('Error en el feed RSS')

    feedTitle.value = json.feed.title
    noticias.value = json.items

    saveToCache({ items: json.items, feedTitle: json.feed.title })
  } catch (e) {
    console.error('[News]', e)
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}

onMounted(loadNoticias)
</script>

<template>
  <section class="container py-4">
    <header class="mb-4">
      <h2 class="mb-1">Noticias y Blog</h2>
      <p class="news-muted small mb-0">{{ feedTitle }}</p>
    </header>

    <div v-if="isLoading" class="news-muted">Cargando noticias...</div>

    <div v-else-if="error" class="text-danger">{{ error }}</div>

    <div v-else class="row g-3">
      <div
        v-for="noticia in noticias"
        :key="noticia.guid"
        class="col-sm-6 col-lg-4"
      >
        <div class="news-card h-100">
          <!-- Imagen -->
          <div class="news-card__img-wrap">
            <img
              v-if="noticia.enclosure?.link"
              :src="noticia.enclosure.link"
              :alt="noticia.title"
              class="news-card__img"
            />
            <div v-else class="news-card__img-placeholder">
              <i class="bi bi-newspaper"></i>
            </div>
          </div>

          <!-- Contenido -->
          <div class="news-card__body">
            <div class="news-muted small mb-2">{{ formatDate(noticia.pubDate) }}</div>
            <h5 class="news-card__title">{{ noticia.title }}</h5>
            <p class="news-muted small flex-grow-1">{{ stripHtml(noticia.description) }}</p>
            <a
              :href="noticia.link"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-news"
            >
              Leer más
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.news-card {
  background: linear-gradient(180deg, #1a3a5c 0%, #0f2744 100%);
  border: 1px solid #2a5a8c;
  border-radius: 0.75rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: #ffffff;

  &__img-wrap {
    width: 100%;
    height: 180px;
    overflow: hidden;
    flex-shrink: 0;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__img-placeholder {
    width: 100%;
    height: 100%;
    background: #0f2744;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: #a8c4e0;
  }

  &__body {
    padding: 1rem 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  &__title {
    font-size: 0.95rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #ffffff;
  }
}

.news-muted {
  color: #a8c4e0;
}

.btn-news {
  display: inline-block;
  margin-top: auto;
  padding: 0.3rem 0.8rem;
  font-size: 0.85rem;
  border: 1px solid #4a9edd;
  border-radius: 0.4rem;
  color: #4a9edd;
  text-decoration: none;
  transition: background 0.2s;

  &:hover {
    background: #4a9edd;
    color: #ffffff;
  }
}
</style>
