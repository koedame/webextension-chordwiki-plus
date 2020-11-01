// 不要になるscriptとiframeを削除
const scriptTags: NodeList = window.document.querySelectorAll('script,iframe,style,link[rel="stylesheet"]');
scriptTags.forEach((value: Node, key: number, parent: NodeList): void => {
  value.parentNode.removeChild(value);
});

import Vue from 'vue';

import Buefy from 'buefy';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);
Vue.component('vue-fontawesome', FontAwesomeIcon);
Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas',
});

import Clipboard from 'v-clipboard';
Vue.use(Clipboard);

import VueMeta from 'vue-meta';
Vue.use(VueMeta);

import store from '../store';

const SongPageElement = document.createElement('app');
SongPageElement.setAttribute('id', 'chordwiki-plus-app');
document.body.innerHTML = SongPageElement.outerHTML;

import router from './router';

//@ts-ignore
import App from './App';
new Vue({
  el: '#chordwiki-plus-app',
  store,
  router,
  components: {
    App,
  },
});

store.dispatch('config/restoreFromLocalStorage');
