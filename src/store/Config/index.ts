const browser = require('webextension-polyfill');

import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { ConfigState, RootState } from '../types';

const state: ConfigState = {
  chordDiagram: false,
};

const getters: GetterTree<ConfigState, RootState> = {
  chordDiagram: (state) => {
    return state.chordDiagram;
  },
};

const mutations: MutationTree<ConfigState> = {
  restoreFromLocalStorage: (state) => {
    browser.storage.local
      .get('config')
      //@ts-ignore
      .then(({ config }) => {
        Object.assign(state, config);
      })
      .then(() => {
        browser.storage.local.set({
          config: JSON.parse(JSON.stringify(state)),
        });
      });
  },
  setChordDiagram: (state, value: boolean) => {
    state.chordDiagram = value;

    browser.storage.local.set({
      config: JSON.parse(JSON.stringify(state)),
    });
  },
};

const actions: ActionTree<ConfigState, RootState> = {
  setChordDiagram({ commit }, value: boolean) {
    commit('setChordDiagram', value);
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
