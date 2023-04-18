import { createApp } from "vue";
import '@/assets/css/tailwind.css'
import { createPinia } from "pinia";
import { store } from "./stores/Notification.js";
import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(store)

app.mount("#app");
