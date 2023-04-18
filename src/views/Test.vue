<template>
    <div>
        <h1>Connexion au serveur websocket</h1>
        <ul>
            <li v-for="message in messages" :key="message.id">{{ message.text }}</li>
        </ul>
        <button @click="testConnection">Connexion</button>
    </div>
</template>
  
<script>
import { w3cwebsocket } from 'websocket';

export default {
  name: 'Test',
  data() {
    return {
      message: ''
    }
  },
  methods: {
    testConnection() {
      const socket = new w3cwebsocket('ws://localhost:8000/ws');

      socket.onopen = () => {
        console.log('Connexion établie');
        socket.send('Test de connexion');
      };

      socket.onerror = (error) => {
        console.error('Erreur de connexion', error);
      };

      socket.onmessage = (event) => {
        console.log('Message reçu', event.data);
        this.message = event.data;
      };

      socket.onclose = () => {
        console.log('Connexion fermée');
      };
    }
  }
}
</script>