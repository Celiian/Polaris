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
      <div class="options-container"></div>
      <div class="main-buttons-actions">
        <button
          @click="copyInviteLink"
          class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
        >
          Inviter
        </button>
      </div>
    </div>
  </div>
  <form v-if="token" class="flex flex-col items-center" @submit.prevent="submitFormJoin">
    <div class="mb-4">
      <input
        type="text"
        id="name"
        v-model="namePlayer"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        placeholder="Entrez votre nom"
      />
    </div>
    <button
      type="submit"
      class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
    >
      Rejoindre la partie
    </button>
  </form>
</template>

<script>
import { mapActions } from "pinia";
import { useGameStore } from "../store/myStore";

export default {
  data() {
    return {
      token: "",
      isRedirecting: false,
      playerOwner: "",
      GameRoomID: "",
      TokenAccessGame: "",
      players: [],
    };
  },

  created() {
    console.log("Starting connection to WebSocket Server");
    var connection = new WebSocket("ws://localhost:8000/gameroom");

    connection.onmessage = function (event) {
      console.log(event);
    };

    connection.onopen = function (event) {
      console.log(event);
      console.log("Successfully connected to the echo websocket server...");
      connection.send("hrlllo");
    };
  },
  methods: {
    ...mapActions(useGameStore, ["getGameRoomById"]),
    submitFormJoin() {
      const namePlayer = this.namePlayer;
      this.joinRoomGame(namePlayer, this.token);
    },

    copyInviteLink() {
      const lienGenere = localStorage.getItem("linkInviteGameRoom");
      if (lienGenere) {
        console.log("Le lien a déjà été généré :", lienGenere);
        return;
      }
      let lien = window.location.origin + "/gameroom/" + this.TokenAccessGame;
      console.log(lien);
      navigator.clipboard.writeText(lien).then(
        () => {
          console.log("Lien copié dans le presse-papiers :", lien);
        },
        () => {
          console.error("Erreur lors de la copie du lien dans le presse-papiers");
        }
      );
      localStorage.setItem("linkInviteGameRoom", lien);
    },
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    console.log(params);
    this.token = params.get("room");
    console.log(localStorage.getItem("GameRoomID"));
    this.GameRoomID = localStorage.getItem("GameRoomID");
    if (this.GameRoomID) {
      this.getGameRoomById(this.GameRoomID)
        .then((response) => {
          this.players = response.data.players;
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("GameRoomID is not defined in localStorage");
    }

    this.playerOwner = localStorage.getItem("playerOwner");
    this.TokenAccessGame = localStorage.getItem("TokenAccessGame");

    window.addEventListener("beforeunload", (event) => {
      localStorage.removeItem("TokenAccessGame");
      localStorage.removeItem("playerOwner");
      localStorage.removeItem("GameRoomID");
      localStorage.removeItem("linkInviteGameRoom");
    });
  },
};
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
