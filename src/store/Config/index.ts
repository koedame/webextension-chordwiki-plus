const browser = require('webextension-polyfill');

import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { ConfigState, RootState } from '../types';

const state: ConfigState = {
  chordDiagram: false,
  scrollGuide: true,
  embedYouTube: true,
};

const getters: GetterTree<ConfigState, RootState> = {
  chordDiagram: (state) => {
    return state.chordDiagram;
  },
  scrollGuide: (state) => {
    return state.scrollGuide;
  },
  embedYouTube: (state) => {
    return state.embedYouTube;
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

    browser.storage.local
      .get('configEmbedYouTube')
      //@ts-ignore
      .then(({ configEmbedYouTube }) => {
        state.embedYouTube = configEmbedYouTube;
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
  setEmbedYouTube: (state, value: boolean) => {
    browser.storage.local
      .set({
        configEmbedYouTube: value,
      })
      .then(() => {
        state.embedYouTube = value;
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
  setEmbedYouTube({ commit }, value: boolean) {
    commit('setEmbedYouTube', value);
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
