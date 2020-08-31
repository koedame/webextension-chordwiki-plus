const browser = require('webextension-polyfill');

import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { ConfigState, RootState } from '../types';

const state: ConfigState = {
  chordDiagram: false,
  scrollGuide: true,
};

const getters: GetterTree<ConfigState, RootState> = {
  chordDiagram: (state) => {
    return state.chordDiagram;
  },
  scrollGuide: (state) => {
    return state.scrollGuide;
  },
};

const mutations: MutationTree<ConfigState> = {
  restoreFromLocalStorage: (state) => {
    browser.storage.local
      .get('configChordDiagram')
      //@ts-ignore
      .then(({ configChordDiagram }) => {
        state.chordDiagram = configChordDiagram;
      });

    browser.storage.local
      .get('configScrollGuide')
      //@ts-ignore
      .then(({ configScrollGuide }) => {
        state.scrollGuide = configScrollGuide;
      });
  },
  setChordDiagram: (state, value: boolean) => {
    browser.storage.local
      .set({
        configChordDiagram: value,
      })
      .then(() => {
        state.chordDiagram = value;
      });
  },
  setScrollGuide: (state, value: boolean) => {
    browser.storage.local
      .set({
        configScrollGuide: value,
      })
      .then(() => {
        state.scrollGuide = value;
      });
  },
};

const actions: ActionTree<ConfigState, RootState> = {
  setChordDiagram({ commit }, value: boolean) {
    commit('setChordDiagram', value);
  },
  setScrollGuide({ commit }, value: boolean) {
    commit('setScrollGuide', value);
  },
  restoreFromLocalStorage({ commit }) {
    commit('restoreFromLocalStorage');
  },
};

export const config: Module<ConfigState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
