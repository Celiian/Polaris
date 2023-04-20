<template>
  <div class="gameroom-container">
    <div class="video-wrapper">
      <video autoplay loop muted src="/src/assets/video/background-home.webm"></video>
    </div>
    <div class="p-20 flex flex-col">
      <h1 class="text-white pt-20 text-center font-bold text-2xl">Bienvenue dans votre GameLobby</h1>
      <div class="flex flex-row p-14 justify-around">
        <div class="players-list-container">
          <div class="flex flex-col">
            <p>{{ playerOwner }}</p>
            <p class="text-white" v-for="(player, index) in players" :key="index">{{ player }}</p>
          </div>
        </div>
        <div class="options-container">
          Voici tous les options
          <ul>
            <li>Taille de la Carte</li>
            <li>Nombre de joueurs </li>
            <li>Durée de partie</li>
            <li>Voleur</li>
          </ul>
          <div class="main-buttons-actions">
            <ButtonInvite :message="'Inviter'" :onClick="copyInviteLink" />
            <ButtonStartGame :message="'Start'" :onClick="startGame" />
          </div>
        </div>
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
          role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          <div>
            <div class="mt-3 text-center sm:mt-5">
              <h3 class="text-lg leading-6 font-medium text-white" id="modal-headline">
                Entrez votre nom pour rejoindre la partie
              </h3>
              <div class="mt-2">
                <form @submit.prevent="submitFormJoin">
                  <div class="mb-4">
                    <input type="text" id="name" v-model="namePlayer"
                      class="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Entrez votre nom" />
                  </div>
                  <div class="flex justify-center">
                    <button type="submit"
                      class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">
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

import ButtonInvite from "../components/ButtonInvite.vue";
import ButtonStartGame from "../components/ButtonStartGame.vue";

import { mapActions } from "pinia";
import { useGameStore } from "../store/myStore";

export default {
  components: {
    ButtonInvite,
    ButtonStartGame
  },

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
      const data = JSON.parse(event.data);
      this.players = data.players;
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

    setInterval(() => {
      const message = JSON.stringify({
        request: "/game_room",
        GameRoomID: localStorage.getItem("GameRoomID"),
      });
      ws.send(message);
    }, 1000);
  },

  methods: {
    ...mapActions(useGameStore, ["getGameRoomById", "joinRoomGame"]),
    submitFormJoin() {
      const namePlayer = this.namePlayer;
      var editedToken = this.token.slice(0, -2);
      this.joinRoomGame(namePlayer, editedToken);
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
    startGame(){
      this.$router.push('/')
    }
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    this.token = params.get("room");
    if (this.token.endsWith("0")) {
      this.token = null;
    }

    this.playerOwner = localStorage.getItem("playerOwner");
    this.TokenAccessGame = localStorage.getItem("TokenAccessGame");

    window.addEventListener("beforeunload", this.handleBeforeUnload);
  },

  handleBeforeUnload(event) {
    if (performance.navigation.type !== 1 && performance.navigation.type !== 0) {
      localStorage.removeItem("TokenAccessGame");
      localStorage.removeItem("playerOwner");
      localStorage.removeItem("GameRoomID");
      localStorage.removeItem("linkInviteGameRoom");
    } else {
      event.preventDefault();
      event.returnValue = "";
    }
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

.main-buttons-actions {
  display: flex;
  width: 300px;
  justify-content: space-between;
  padding-top: 50px;
}
</style>
