const browser = require('webextension-polyfill');

import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { ConfigState, RootState } from '../types';

const state: ConfigState = {
  chordDiagram: false,
  scrollGuide: true,
  embedPlayer: true,
};

const getters: GetterTree<ConfigState, RootState> = {
  chordDiagram: (state) => {
    return state.chordDiagram;
  },
  scrollGuide: (state) => {
    return state.scrollGuide;
  },
  embedPlayer: (state) => {
    return state.embedPlayer;
  },
};

const mutations: MutationTree<ConfigState> = {
  restoreFromLocalStorage: (state) => {
    browser.storage.local
      .get('configChordDiagram')
      //@ts-ignore
      .then(({ configChordDiagram }) => {
        if (typeof configChordDiagram !== 'undefined') {
          state.chordDiagram = configChordDiagram;
        }
      });

    browser.storage.local
      .get('configScrollGuide')
      //@ts-ignore
      .then(({ configScrollGuide }) => {
        if (typeof configScrollGuide !== 'undefined') {
          state.scrollGuide = configScrollGuide;
        }
      });

    browser.storage.local
      .get('configEmbedPlayer')
      //@ts-ignore
      .then(({ configEmbedPlayer }) => {
        if (typeof configEmbedPlayer !== 'undefined') {
          state.embedPlayer = configEmbedPlayer;
        }
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
  setEmbedPlayer: (state, value: boolean) => {
    browser.storage.local
      .set({
        configEmbedPlayer: value,
      })
      .then(() => {
        state.embedPlayer = value;
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
  setEmbedPlayer({ commit }, value: boolean) {
    commit('setEmbedPlayer', value);
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
