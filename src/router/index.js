import { createRouter, createWebHistory } from "vue-router";
import Map from "../components/Map.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Map,
    },
    {
      path: "/map",
      name: "map",
      component: Map,
    },
  ],
});

export default router;
