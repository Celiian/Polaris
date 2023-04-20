<template>
  <div class="gameroom-container">
    <div class="video-wrapper">
      <video autoplay loop muted src="/src/assets/video/background-home.webm"></video>
    </div>
    <h1 class="text-white">Bienvenue dans votre gameroom, {{ playerOwner }} !</h1>
    <div class="main-gameroom-container">
      <div class="players-list-container">
        <div class="flex flex-column">
          <h2 class="text-white">Liste des joueurs :</h2>
          <p class="text-white" v-for="(player, index) in players" :key="index">{{ player }}</p>
        </div>
      </div>
      <div class="options-container">

      </div>
      <div class="main-buttons-actions">
        <button @click="copyInviteLink"
          class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">Inviter</button>
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
      isRedirecting: false,
      playerOwner: '',
      GameRoomID: '',
      TokenAccessGame: '',
      players: [],
    }
  },
  methods: {
    ...mapActions(useGameStore, ["getGameRoomById"]),
    copyInviteLink() {
      const lienGenere = localStorage.getItem('linkInviteGameRoom');
      if (lienGenere) {
        console.log('Le lien a déjà été généré :', lienGenere);
        return;
      }
      let lien = window.location.origin + "?token=" + this.TokenAccessGame;
      console.log(lien)
      navigator.clipboard.writeText(lien).then(() => {
        console.log('Lien copié dans le presse-papiers :', lien);
      }, () => {
        console.error('Erreur lors de la copie du lien dans le presse-papiers');
      });
      localStorage.setItem('linkInviteGameRoom', lien);
    }
  },
  mounted() {
    console.log(localStorage.getItem('GameRoomID'))
    this.GameRoomID = localStorage.getItem('GameRoomID');
    if (this.GameRoomID) {
      this.getGameRoomById(this.GameRoomID).then((response) => {
        this.players = response.data.players;
      }).catch((error) => {
        console.log(error);
      });
    } else {
      console.log('GameRoomID is not defined in localStorage');
    }

    this.playerOwner = localStorage.getItem('playerOwner');
    this.TokenAccessGame = localStorage.getItem('TokenAccessGame');

    window.addEventListener('beforeunload', (event) => {
      localStorage.removeItem('TokenAccessGame');
      localStorage.removeItem('playerOwner');
      localStorage.removeItem('GameRoomID');
      localStorage.removeItem('linkInviteGameRoom');
    });
  },
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