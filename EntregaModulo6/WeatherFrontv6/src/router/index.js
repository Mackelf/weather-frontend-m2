import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PronosticosView from '../views/PronosticosView.vue'
import LugarDetalleView from '../views/LugarDetalleView.vue'
import NewsView from '../views/NewsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/pronosticos',
      name: 'pronosticos',
      component: PronosticosView,
    },
    {
      path: '/pronosticos/:country/:city',
      name: 'lugar-detalle',
      component: LugarDetalleView,
      props: true,
    },
    {
      path: '/news',
      name: 'news',
      component: NewsView,
    },
  ],
})

export default router
