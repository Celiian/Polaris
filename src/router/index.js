import { createRouter, createWebHistory } from "vue-router";
import HexagonalGrid from "../components/HexagonalGrid.vue";
//import Map from "../components/Map.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HexagonalGrid,
    },
    /*{
      path: "/map",
      name: "map",
      component: Map,
    },*/
  ],
});

export default router;
