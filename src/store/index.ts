import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

import { config } from './Config';
import { autoScroll } from './AutoScroll';

Vue.use(Vuex);

import { RootState } from './types';

const store: StoreOptions<RootState> = {
  state: {
    version: '1.0.0',
  },
  modules: {
    config,
    autoScroll,
  },
};

export default new Vuex.Store<RootState>(store);
