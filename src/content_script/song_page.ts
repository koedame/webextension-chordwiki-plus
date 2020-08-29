console.log('songpage');

import Vue from 'vue';

import Buefy from 'buefy';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas, far, fab);
Vue.component('vue-fontawesome', FontAwesomeIcon);
Vue.use(Buefy, {
  defaultIconComponent: 'vue-fontawesome',
  defaultIconPack: 'fas',
});

// Vueをマウントする要素を追加
let titleElement = document.querySelector('.subtitle');
if (titleElement === null) {
  titleElement = document.querySelector('.title');
}
const chordwikiPlusSongMenuElement = document.createElement('div');
chordwikiPlusSongMenuElement.setAttribute('id', 'chordwiki-plus-song-menu');
titleElement.parentNode.insertBefore(chordwikiPlusSongMenuElement, titleElement.nextElementSibling);

import Clipboard from 'v-clipboard';
Vue.use(Clipboard);

//@ts-ignore
import SongMenu from './components/SongMenu';
// import store from '../store';

new Vue({
  el: '#chordwiki-plus-song-menu',
  // store: store,
  render: (h) => h(SongMenu),
});
