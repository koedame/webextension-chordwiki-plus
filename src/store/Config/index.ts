const browser = require('webextension-polyfill');

import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { ConfigState, RootState } from '../types';

const state: ConfigState = {
  chordDiagram: false,
  scrollGuide: true,
  styleBold: true,
};

const getters: GetterTree<ConfigState, RootState> = {
  chordDiagram: (state) => {
    return state.chordDiagram;
  },
  scrollGuide: (state) => {
    return state.scrollGuide;
  },
  styleBold: (state) => {
    return state.styleBold;
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
      .get('configStyleBold')
      //@ts-ignore
      .then(({ configStyleBold }) => {
        if (typeof configStyleBold !== 'undefined') {
          state.styleBold = configStyleBold;
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
  setStyleBold: (state, value: boolean) => {
    browser.storage.local
      .set({
        configStyleBold: value,
      })
      .then(() => {
        state.styleBold = value;
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
  setStyleBold({ commit }, value: boolean) {
    commit('setStyleBold', value);
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
