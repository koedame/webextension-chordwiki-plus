import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';

import { clock } from './Clock';

//@ts-ignore
import createMutationsSharer from 'vuex-shared-mutations';

Vue.use(Vuex);

import { RootState } from './types';

const store: StoreOptions<RootState> = {
  state: {
    version: '1.0.0',
  },
  modules: {
    clock,
  },
  plugins: [
    // 複数Tab/Windowでのstateの共有
    createMutationsSharer({
      predicate: (mutation: any) => {
        const predicate: Array<string> = [];
        // .concat(Object.keys(favoriteMembers.mutations).map((name) => `favoriteMembers/${name}`))
        // Conditionally trigger other plugins subscription event here to
        // have them called only once (in the tab where the commit happened)
        // ie. save certain values to localStorage
        // pluginStateChanged(mutation, state)
        return predicate.indexOf(mutation.type) >= 0;
      },
    }),
  ],
};

export default new Vuex.Store<RootState>(store);
