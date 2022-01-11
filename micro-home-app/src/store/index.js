import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentRequestCount: 0
  },
  getters: {},
  mutations: {
    changeCurrentRequestCount(state, n) {
      state.currentRequestCount += n;
    }
  },
  actions: {}
});
