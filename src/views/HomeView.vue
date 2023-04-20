<template>
  <div class="h-screen">
    <div class="video-wrapper">
      <video autoplay loop muted src="/src/assets/video/background-home.webm"></video>
    </div>
    <div class="p-8 main-content">
      <h1 class="flex w-full justify-center font-bold text-center text-lime-400 text-6xl mb-8">
        Bienvenue sur Colons de Polaris
      </h1>
      <div class="container-main">
        <div class="bg-white rounded-md shadow-md p-4 mb-4">
          <form class="flex flex-col items-center" @submit.prevent="submitFormCreate">
            <div class="mb-4">
              <input
                type="text"
                id="name"
                v-model="nameOwnerPlayer"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Entrez votre nom"
              />
            </div>
            <button
              type="submit"
              class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            >
              Create GameRoom
            </button>
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
  </div>
</template>
<script>
import { mapActions } from "pinia";
import { useGameStore } from "../store/myStore";

export default {
  data() {
    return {
      nameOwnerPlayer: "",
      namePlayer: "",
      generatedToken: "",
      lien: "",
    };
  },
  methods: {
    ...mapActions(useGameStore, ["createRoomGame"]),
    generateLink() {
      const lienGenere = localStorage.getItem("lienGenere");
      if (lienGenere) {
        console.log("Le lien a déjà été généré :", lienGenere);
        return;
      }
      const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      this.lien = "/gameroom?room=";
      let generatedToken = "";
      for (let i = 0; i < 15; i++) {
        generatedToken += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
      }
      this.lien += generatedToken;
      console.log("Lien d'invitation : " + this.lien);
      this.generatedToken = generatedToken;
    },
    submitFormCreate() {
      const nameOwnerPlayer = this.nameOwnerPlayer;
      this.generateLink();
      const tokenRoom = this.generatedToken;
      this.createRoomGame(nameOwnerPlayer, tokenRoom)
        .then((response) => {
          const playerOwner = response.owner_room_game;
          const createdGameRoomId = response.room_id;
          const generatedTokenGameRoom = response.token_game_room;
          localStorage.setItem("playerOwner", playerOwner);
          localStorage.setItem("GameRoomID", createdGameRoomId);
          localStorage.setItem("TokenAccessGame", generatedTokenGameRoom);
          this.$router.push(this.lien);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
video {
  @apply -z-10 fixed top-0 left-0 w-full h-full object-cover;
}

.container-main {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-around;
}
</style>
