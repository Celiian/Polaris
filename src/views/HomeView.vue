<template>
  <div class="home-page">
    <template v-if="!token">
      <div class="video-wrapper">
        <video autoplay loop muted src="/src/assets/video/background-home.webm"></video>
      </div>
      <div class="main-content">
        <h1 class="flex w-full justify-center font-bold text-center text-white">Bienvenue sur Colons de Polaris</h1>
        <div class="container-main">
          <div class="bg-white rounded-md shadow-md p-4 mb-4">
            <form class="flex flex-col items-center" @submit.prevent="submitForm">
              <div class="mb-4">
                <input type="text" id="name" v-model="nom"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Entrez votre nom">
              </div>
              <button type="submit"
                class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">Create
                GameRoom</button>
            </form>
          </div>
          <div class="bg-white rounded-md shadow-md p-4">
            <img :src="'@/public/icons/rules-icon.svg'" />
            <h2 class="text-lg font-bold mb-2">Règles du jeu</h2>
            <ul class="list-disc list-inside">
              <li>Le jeu se joue à deux joueurs.</li>
              <li>Chaque joueur a 21 pièces.</li>
              <li>Les joueurs se relaient pour placer une pièce sur le plateau.</li>
              <li>Le premier joueur à aligner 4 pièces gagne.</li>
            </ul>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="video-wrapper">
        <video autoplay loop muted src="/src/assets/video/background-home.webm"></video>
      </div>
      <div class="main-content">
        <h1 class="flex w-full justify-center font-bold text-center text-white">Vous avez été invitez à une partie Colons de Polaris !</h1>
        <div class="container-main">
          <div class="bg-white rounded-md shadow-md p-4 mb-4">
            <form class="flex flex-col items-center" @submit.prevent="submitForm">
              <div class="mb-4">
                <input type="text" id="name" v-model="nom"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Entrez votre nom">
              </div>
              <button type="submit"
                class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">Rejoindre la partie</button>
            </form>
          </div>
          <div class="bg-white rounded-md shadow-md p-4">
            <img :src="'@/public/icons/rules-icon.svg'" />
            <h2 class="text-lg font-bold mb-2">Règles du jeu</h2>
            <ul class="list-disc list-inside">
              <li>Le jeu se joue à deux joueurs.</li>
              <li>Chaque joueur a 21 pièces.</li>
              <li>Les joueurs se relaient pour placer une pièce sur le plateau.</li>
              <li>Le premier joueur à aligner 4 pièces gagne.</li>
            </ul>
          </div>
        </div>
      </div>

    </template>
  </div>
</template>
<script>

export default {
  data() {
    return {
      nom: '',
      token: '',
    }
  },
  methods: {
    submitForm() {
      const nom = this.nom;
      this.$router.push({ name: 'gameroom', params: { nom } });
    }
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    this.token = params.get('token');
  }
}
</script>



<style scoped>
.home-page {
  height: 100vh;
}

video {
  position: fixed;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: #242424;
  color: white;
  padding: 2rem;
  width: 20%;
}

.main-content {
  padding: 2rem;
  width: 100%;
}

.main-content h1 {
  font-size: 4rem;
  margin-bottom: 2rem;
}

.rules h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.name-form h2 {
  font-size: 2rem;
}

label {
  display: block;
  font-size: 1.5rem;
}

.container-main {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-around;
}
</style>