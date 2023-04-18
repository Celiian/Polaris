<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <div v-for="(notification, index) in notifications" :key="index" class="fixed top-0">
            <Notification :title="notification.title" :message="notification.message" :iconClass="notification.iconClass" />
        </div>
        <button @click="addNotification" class="mt-auto">Add Notification</button>
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
                message: "la journée à été fructueuse vous avez gagné x ressources",
                iconClass: "h-10 w-10",
            };

            this.$store.dispatch("addNotification", notification);

            setTimeout(() => {
                this.$store.dispatch("removeNotification", notification);
            }, 6000);
        },

    },
};
</script>