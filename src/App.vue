<template>
  <div id="app">
    <Map></Map>
  </div>
</template>

<script>
import Map from "./components/Map.vue";

export default {
  name: "App",
  components: {
    Map,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
