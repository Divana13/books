import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import router from '@/route'
import i18n from './i18n'

const pinia = createPinia();

createApp(App)
    .use(router)
    .use(pinia)
    .use(i18n)
    .mount('#app')
