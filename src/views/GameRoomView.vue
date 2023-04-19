<template>
  <div class="gameroom-container">
    <div class="video-wrapper">
      <video autoplay loop muted src="/src/assets/video/background-home.webm"></video>
    </div>
    <p>Bienvenue dans votre gameroom, {{ nom }} !</p>
    <div class="main-gameroom-container">
      <div class="players-list-container">
        <li>{{ nom }}</li>
      </div>
      <div class="options-container">

      </div>
      <div class="main-buttons-actions">
        <button @click="generateLink"
          class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">Inviter</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      isRedirecting: false
    }
  },
  methods: {
    startGame() {
    },
  },
  mounted() {
    const nom = this.$route.params.nom;
    console.log(nom);
    window.addEventListener('beforeunload', (event) => {
      localStorage.removeItem('lienGenere');
    });
  },
  computed: {
    nom() {
      return this.$route.params.nom;
    }
  }

}
</script>

<style scoped>
video {
  position: fixed;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>