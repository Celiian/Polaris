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
    <div v-if="token" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity">
          <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        &#8203;
        <div
          class="inline-block align-bottom bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div>
            <div class="mt-3 text-center sm:mt-5">
              <h3 class="text-lg leading-6 font-medium text-white" id="modal-headline">
                Entrez votre nom pour rejoindre la partie
              </h3>
              <div class="mt-2">
                <form @submit.prevent="submitFormJoin">
                  <div class="mb-4">
                    <input
                      type="text"
                      id="name"
                      v-model="namePlayer"
                      class="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Entrez votre nom"
                    />
                  </div>
                  <div class="flex justify-center">
                    <button
                      type="submit"
                      class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                    >
                      Rejoindre la partie
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
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
      token: "",
      isRedirecting: false,
      playerOwner: "",
      GameRoomID: "",
      TokenAccessGame: "",
      players: [],
    };
  },

  created() {
    this.GameRoomID = localStorage.getItem("GameRoomID");

    console.log("Starting connection to WebSocket Server");
    var ws = new WebSocket("ws://localhost:8000/gameroom/" + this.GameRoomID);

    ws.onmessage = (event) => {
      console.log(event);
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.request === "getGameRoomById") {
        console.log(data);
        //this.players = data.response.players;
      }
    };

    ws.onopen = function (event) {
      console.log(event);
      console.log("Successfully connected to the echo websocket server...");
      if (localStorage.getItem("GameRoomID")) {
        const message = JSON.stringify({
          request: "/game_room",
          GameRoomID: localStorage.getItem("GameRoomID"),
        });
        ws.send(message);
        console.log("GameRoomID sent");
      } else {
        console.log("GameRoomID is not defined");
      }
    };
  },

  methods: {
    ...mapActions(useGameStore, ["getGameRoomById", "joinRoomGame"]),
    submitFormJoin() {
      const namePlayer = this.namePlayer;
      this.joinRoomGame(namePlayer, this.token);
      this.token = null;
    },

    copyInviteLink() {
      const lienGenere = localStorage.getItem("linkInviteGameRoom");
      if (lienGenere) {
        console.log("Le lien a déjà été généré :", lienGenere);
        return;
      }
      let lien = window.location.href;
      let newLien = lien.slice(0, -1) + "1";

      navigator.clipboard.writeText(newLien).then(
        () => {
          console.log("Lien copié dans le presse-papiers :", newLien);
        },
        () => {
          console.error("Erreur lors de la copie du lien dans le presse-papiers");
        }
      );
      localStorage.setItem("linkInviteGameRoom", newLien);
    },
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    this.token = params.get("room");
    if (this.token.endsWith("0")) {
      this.token = null;
    }

    this.playerOwner = localStorage.getItem("playerOwner");
    this.TokenAccessGame = localStorage.getItem("TokenAccessGame");

    // window.addEventListener("beforeunload", (event) => {
    //   localStorage.removeItem("TokenAccessGame");
    //   localStorage.removeItem("playerOwner");
    //   localStorage.removeItem("GameRoomID");
    //   localStorage.removeItem("linkInviteGameRoom");
    // });
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
