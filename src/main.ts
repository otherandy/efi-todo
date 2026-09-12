import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './app.vue';
import './main.scss';
import 'emoji-mart-vue-fast-next/css/emoji-mart.css';

createApp(App)
    .use(createPinia())
    .mount('#app');

    

// Register service worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/service-worker.js");
  });
}