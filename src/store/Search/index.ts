const browser = require('webextension-polyfill');

import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { SearchState, RootState } from '../types';

const state: SearchState = {
  keyword: '',
};

const getters: GetterTree<SearchState, RootState> = {
  keyword: (state) => {
    return state.keyword;
  },
};

const mutations: MutationTree<SearchState> = {
  setKeyword: (state, value: string) => {
    state.keyword = value;
  },
};

const actions: ActionTree<SearchState, RootState> = {
  setKeyword({ commit }, value: string) {
    commit('setKeyword', value);
  },
};

export const search: Module<SearchState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
