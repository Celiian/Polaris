import { createStore } from 'vuex'

export const store = createStore({
  state: {
    notifications: [],
  },
  mutations: {
    addNotification(state, notification) {
      state.notifications.push(notification);
    },
    removeNotification(state, notification) {
      const index = state.notifications.indexOf(notification);
      state.notifications.splice(index, 1);
    },
  },
  actions: {
    addNotification({ commit }, notification) {
      commit("addNotification", notification);
    },
    removeNotification({ commit }, notification) {
      commit("removeNotification", notification);
    },
  },
});
