import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import './assets/css/tailwind.css'

import store from './stores/Notification.js';

const app = createApp(App);
app.use(createPinia());
app.use(store);
app.use(router);

app.mount("#app");
