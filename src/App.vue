<template>
  <div id="app">
    <img alt="Vue logo" src="https://vuejs.org/images/logo.png" class="h-16 w-16 mx-auto" />
    <div>
      <RouterLink class="pr-2" to="/">Accueil</RouterLink>
      <RouterLink class="pr-2" to="/about">À propos</RouterLink>
      <RouterLink to="/notification">Notification</RouterLink>
    </div>
    <RouterView />
  </div>
</template>

<script>
import { RouterView, RouterLink } from "vue-router";

export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
