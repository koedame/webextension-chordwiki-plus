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

// import store from '../store';

import Clipboard from 'v-clipboard';
Vue.use(Clipboard);

const queryString = require('query-string');
import addOriginalKeyButton from '../lib/add_original_key_button';

// 移調文字をリンク化
document.body.innerHTML = addOriginalKeyButton(document.body.innerHTML, location.search);

// SongMenuをマウントする要素を追加
let titleElement = document.querySelector('.subtitle');
if (titleElement === null) {
  titleElement = document.querySelector('.title');
}
const chordwikiPlusSongMenuElement = document.createElement('div');
chordwikiPlusSongMenuElement.setAttribute('id', 'chordwiki-plus-song-menu');
titleElement.parentNode.insertBefore(chordwikiPlusSongMenuElement, titleElement.nextElementSibling);

//@ts-ignore
import SongMenu from './components/SongMenu';
new Vue({
  el: '#chordwiki-plus-song-menu',
  // store: store,
  render: (h) => h(SongMenu),
});
