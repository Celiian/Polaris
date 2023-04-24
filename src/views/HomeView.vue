<template>
  <div class="h-screen">
    <template v-if="!token">
      <div class="video-wrapper">
        <video autoplay loop muted src="/src/assets/video/background-home.webm"></video>
      </div>
      <div class="p-8 main-content">
        <img src="/logo.png" class="h-full w-56 items-center mx-auto" alt="logo">
        <div class="container-main">
          <div class="p-10 opacity-70">
            <div class="card">
              <div class="card__content">
                <form @submit.prevent="submitForm"
                  class="flex flex-col items-center bg-transparent p-8 rounded-xl">
                  <input type="text" placeholder="Name"
                    class="text-white outline-none bg-transparent border-solid border-b-white border-b-2 p-2 rounded-xl mb-8 border-transparent placeholder:text-white"
                    v-model="nom" />
                  <button class="custom-button"
                    type="submit">Create GameRoom</button>
                </form>
              </div>
            </div>
          </div>
          <Rules class="opacity-60 w-1/3 h-auto"></Rules>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="video-wrapper">
        <video autoplay loop muted src="/src/assets/video/background-home.webm"></video>
      </div>
      <div class="p-8 w-full">
        <img src="/logo.png" class="h-full w-56 items-center mx-auto" alt="logo">
        <div class="container-main">
          <div class="p-10 opacity-70">
            <div class="card">
                <div class="card__content">
                  <form @submit.prevent="submitForm"
                    class="flex flex-col items-center bg-transparent p-8 rounded-xl">
                    <input type="text" placeholder="Name"
                      class="text-white outline-none bg-transparent border-solid border-b-white border-b-2 p-2 rounded-xl mb-8 border-transparent placeholder:text-white"
                      v-model="nom" />
                    <button class="custom-button"
                      type="submit">Join GameRoom</button>
                  </form>
                </div>
              </div>
          </div>
          <Rules class="opacity-60 w-1/3 h-auto"></Rules>
        </div>
      </div>

    </template>
  </div>
</template>
<script>
import Rules from '../components/Rules.vue'
export default {
  components: {
    Rules
  },
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

.card {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  padding: 5px;
  box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
  background-image: linear-gradient( 100deg,#AF40FF, #5B42F3 50%,#9000E9);
}

.card__content {
  background: rgb(5, 6, 45);
  border-radius: 17px;
  width: 100%;
  height: 100%;
}

.custom-button {
  --green: #FFFFFF;
  font-size: 15px;
  padding: 0.7em 2.7em;
  letter-spacing: 0.06em;
  position: relative;
  font-family: inherit;
  border-radius: 0.6em;
  overflow: hidden;
  transition: all 0.3s;
  line-height: 1.4em;
  border: 2px solid var(--green);
  background: linear-gradient(to right, rgba(27, 253, 156, 0.1) 1%, transparent 40%,transparent 60% , rgba(27, 253, 156, 0.1) 100%);
  color: var(--green);
  box-shadow: inset 0 0 10px rgba(27, 253, 156, 0.4), 0 0 9px 3px rgba(27, 253, 156, 0.1);
}

.custom-button:hover {
  color: #8500DE;
  box-shadow: inset 0 0 10px rgba(27, 253, 156, 0.6), 0 0 9px 3px rgba(27, 253, 156, 0.2);
}

.custom-button:before {
  content: "";
  position: absolute;
  left: -4em;
  width: 4em;
  height: 100%;
  top: 0;
  transition: transform .4s ease-in-out;
  background: linear-gradient(to right, transparent 1%, rgba(27, 253, 156, 0.1) 40%,rgba(27, 253, 156, 0.1) 60% , transparent 100%);
}

.custom-button:hover:before {
  transform: translateX(15em);
}
</style>