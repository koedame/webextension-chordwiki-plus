const browser = require('webextension-polyfill');

import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { AutoScrollState, RootState } from '../types';

const state: AutoScrollState = {
  scrollSpeed: 150,
  timer: null,
};

const getters: GetterTree<AutoScrollState, RootState> = {};

const mutations: MutationTree<AutoScrollState> = {
  setScrollSpeed: (state, value: number) => {
    state.scrollSpeed = value;
  },
  setTimer: (state, value: number) => {
    state.timer = value;
  },
};

const actions: ActionTree<AutoScrollState, RootState> = {
  setScrollSpeed({ commit }, value: number) {
    commit('setScrollSpeed', value);
  },
  runAutoScroll({ dispatch, commit, state }) {
    if (window.document.getElementById('chordwiki-plus-lyrics').getBoundingClientRect().bottom < window.innerHeight - 100) {
      // 下までいったら自動で止める
      dispatch('stopAutoScroll');
    } else {
      window.scrollBy(0, 1);
      // @ts-ignore
      let timer = setTimeout(() => {
        dispatch('runAutoScroll');
      }, state.scrollSpeed);
      commit('setTimer', timer);
    }
  },
  stopAutoScroll({ commit, state }) {
    clearTimeout(state.timer);
    commit('setTimer', null);
  },
};

export const autoScroll: Module<AutoScrollState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
