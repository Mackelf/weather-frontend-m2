// main.js
import { createApp,  } from 'vue'
import App from './App.vue'
import router from './router'

// CSS de Bootstrap (ya lo tendrás)
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// JS de Bootstrap (importante para Modal, Dropdown, etc.)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/scss/main.scss'
createApp(App).use(router).mount('#app')
