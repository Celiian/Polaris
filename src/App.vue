<template>
  <div>
    <div v-for="(notification, index) in notifications" :key="index">
      <Notification :title="notification.title" :message="notification.message" :iconClass="notification.iconClass" />
    </div>
    <button @click="addNotification" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Ajouter
      une notification</button>
  </div>
</template>

<script>
import Notification from "@/components/Notification.vue";

export default {
  components: {
    Notification,
  },
  computed: {
    notifications() {
      return this.$store.state.notifications;
    },
  },
  methods: {
    addNotification() {
      const notification = {
        title: "Fin de tour",
        message: "la journée à était fructueuse vous avez gagné x ressources",
        iconClass: "fas fa-check-circle text-green-500",
      };

      this.$store.dispatch("addNotification", notification);

      setTimeout(() => {
        this.$store.dispatch("removeNotification", notification);
      }, 6000);
    },

  },
};
</script>