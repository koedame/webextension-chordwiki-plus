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
lyrics.setAttribute('ref', 'chordwikiPlusLyrics');
lyrics.setAttribute('v-on:click', 'toggleAutoScroll');

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

// ニコニコ動画を埋め込み
const matchedNicoVideoID = document.body.innerHTML.match(/href=\"https\:\/\/www\.nicovideo\.jp\/watch\/(sm[0-9]+?)\"/);
if (matchedNicoVideoID) {
  const chordwikiPlusNicoVideoPlayerElement = document.createElement('nico-video-embed-player');
  chordwikiPlusNicoVideoPlayerElement.setAttribute('movie', matchedNicoVideoID[1]);
  titleElement.parentNode.insertBefore(chordwikiPlusNicoVideoPlayerElement, titleElement.nextElementSibling);
}

// YouTube動画を埋め込み
const matchedYouTubeID = document.body.innerHTML.match(/href=\"https\:\/\/www\.youtube\.com\/watch\?v=(.+?)\"/);
if (matchedYouTubeID) {
  const chordwikiPlusYouTubePlayerElement = document.createElement('you-tube-embed-player');
  chordwikiPlusYouTubePlayerElement.setAttribute('movie', matchedYouTubeID[1]);
  titleElement.parentNode.insertBefore(chordwikiPlusYouTubePlayerElement, titleElement.nextElementSibling);
}

// タグ
const tags = [];
const tagElements = document.querySelectorAll('.tag a[itemprop=keywords]');
for (const tagElement of tagElements) {
  // @ts-ignore
  tags.push(tagElement.innerText);
}
// @ts-ignore
if (tags.legnth !== 0) {
  const chordwikiPlusSongTagsElement = document.createElement('song-tags');
  chordwikiPlusSongTagsElement.setAttribute(':tags', JSON.stringify(tags));
  titleElement.parentNode.insertBefore(chordwikiPlusSongTagsElement, titleElement.nextElementSibling);
}

// メトロノームを追加
document.body.innerHTML = document.body.innerHTML.replace(/(BPM.([0-9]+))/g, (match, capture1, capture2) => {
  return `<metronome :bpm="${parseInt(capture2)}"></metronome>${capture1}`;
});

//@ts-ignore
import TransposeButton from './components/TransposeButton';
//@ts-ignore
import SongMenu from './components/SongMenu';
//@ts-ignore
import ScrollAfterimage from './components/ScrollAfterimage';
//@ts-ignore
import ChordDiagram from './components/ChordDiagram';
//@ts-ignore
import Metronome from './components/Metronome';
//@ts-ignore
import YouTubeEmbedPlayer from './components/YouTubeEmbedPlayer';
//@ts-ignore
import NicoVideoEmbedPlayer from './components/NicoVideoEmbedPlayer';
//@ts-ignore
import SongTags from './components/SongTags';
new Vue({
  el: '.main',
  store: store,
  components: {
    TransposeButton,
    SongMenu,
    ScrollAfterimage,
    ChordDiagram,
    Metronome,
    YouTubeEmbedPlayer,
    NicoVideoEmbedPlayer,
    SongTags,
  },
  data() {
    return {
      autoScrollTimer: null,
    };
  },
  methods: {
    toggleAutoScroll() {
      if (this.$store.state.autoScroll.timer) {
        this.$store.dispatch('autoScroll/stopAutoScroll');
      } else {
        this.$store.dispatch('autoScroll/runAutoScroll');
      }
    },
  },
  destroyed() {
    if (this.$store.state.autoScroll.timer) {
      this.$store.dispatch('autoScroll/stopAutoScroll');
    }
  },
});

store.dispatch('config/restoreFromLocalStorage');

// メニューを削除
document.getElementById('key').remove();

// サイドバーを削除
document.getElementById('side').remove();

// zenbackを削除
document.getElementById('zenback-widget-loader').remove();

// フッターを削除
const footerElements = document.getElementsByClassName('footer');
for (const footerElement of footerElements) {
  footerElement.parentNode.removeChild(footerElement);
}

// 自動スクロール速度調整ボタン
const changeAutoScrollSpeedButton = document.createElement('change-auto-scroll-speed-button');
changeAutoScrollSpeedButton.setAttribute('id', 'change-auto-scroll-speed-button');
document.body.appendChild(changeAutoScrollSpeedButton);

//@ts-ignore
import ChangeAutoScrollSpeedButton from './components/ChangeAutoScrollSpeedButton';
new Vue({
  el: '#change-auto-scroll-speed-button',
  store: store,
  components: {
    ChangeAutoScrollSpeedButton,
  },
});

// 独自ヘッダー
const customHeaderElement = document.createElement('custom-header');
customHeaderElement.setAttribute('id', 'custom-header');
document.getElementById('header').outerHTML = customHeaderElement.outerHTML;

//@ts-ignore
import CustomHeader from './components/CustomHeader';
new Vue({
  el: '#custom-header',
  store: store,
  components: {
    CustomHeader,
  },
});

// 独自フッター
const customFooter = document.createElement('custom-footer');
customFooter.setAttribute('id', 'custom-footer');
document.body.appendChild(customFooter);

//@ts-ignore
import CustomFooter from './components/CustomFooter';
new Vue({
  el: '#custom-footer',
  store: store,
  components: {
    CustomFooter,
  },
});
