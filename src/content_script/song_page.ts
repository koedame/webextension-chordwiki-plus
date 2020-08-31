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

import store from '../store';

import Clipboard from 'v-clipboard';
Vue.use(Clipboard);

import addOriginalKeyButton from '../lib/add_original_key_button';

// 移調文字をリンク化
document.body.innerHTML = addOriginalKeyButton(document.body.innerHTML, location.search);

// コードダイアグラムをコンポーネントに置き換え
document.body.innerHTML = document.body.innerHTML.replace(
  /<span class="chord" onclick="javascript:popupImage\('(\/cd\/.+?\.png)', event\);">(.+?)<\/span>/g,
  (match, filePath, chordName) => {
    return `<chord-diagram file-path="${filePath}" chord-name="${chordName}"></chord-diagram>`;
  }
);

// 扱いやすように歌詞部分にIDを付与
const lyrics = document.querySelector('.main > div');
lyrics.setAttribute('id', 'chordwiki-plus-lyrics');
lyrics.setAttribute('ref', 'chordwiki-plus-lyrics');

// SongMenuをマウントする要素を追加
let titleElement = document.querySelector('.subtitle');
if (titleElement === null) {
  titleElement = document.querySelector('.title');
}
const chordwikiPlusSongMenuElement = document.createElement('song-menu');
chordwikiPlusSongMenuElement.setAttribute('id', 'chordwiki-plus-song-menu');
titleElement.parentNode.insertBefore(chordwikiPlusSongMenuElement, titleElement.nextElementSibling);

// スクロール位置がわかるバーを表示
const scrollAfterimageTag = document.createElement('scroll-afterimage');
scrollAfterimageTag.setAttribute('id', 'scroll-afterimage');
lyrics.appendChild(scrollAfterimageTag);

//@ts-ignore
import TransposeButton from './components/TransposeButton';
//@ts-ignore
import SongMenu from './components/SongMenu';
//@ts-ignore
import ScrollAfterimage from './components/ScrollAfterimage';
//@ts-ignore
import ChordDiagram from './components/ChordDiagram';
new Vue({
  el: '.main',
  store: store,
  components: {
    TransposeButton,
    SongMenu,
    ScrollAfterimage,
    ChordDiagram,
  },
});

store.dispatch('config/restoreFromLocalStorage');
