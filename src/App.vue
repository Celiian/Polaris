<template>
  <div id="app">
    <HexagonalGrid />
  </div>
</template>

<script>
import HexagonalGrid from "./components/HexagonalGrid.vue";

export default {
  name: "App",
  components: {
    HexagonalGrid,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  background-color: white;
  color: #2c3e50;
  margin-top: 60px;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
