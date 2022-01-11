import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentRequestCount: 0,
    logo: null
  },
  getters: {},
  mutations: {
    changeCurrentRequestCount(state, n) {
      state.currentRequestCount += n;
    },
    changeLogo(state, logo) {
      state.logo = logo;
    }
  },
  actions: {}
});
