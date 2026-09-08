import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './app.vue';
import './main.scss';
import 'emoji-mart-vue-fast-next/css/emoji-mart.css';
import { OnClickOutside } from '@vueuse/components';

createApp(App)
    .use(createPinia())
    .directive('on-click-outside', OnClickOutside)
    .mount('#app');

    

// Register service worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/service-worker.js");
  });
}