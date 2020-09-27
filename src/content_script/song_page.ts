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

import axios from 'axios';

import { parse } from 'node-html-parser';

//@ts-ignore
import SongPage from './pages/Song';

import parseChordpro from '../lib/parse_chordpro';

async function main() {
  const SongPageElement = document.createElement('song-page');
  SongPageElement.setAttribute('id', 'chordwiki-plus-song-page');

  const queryString = require('query-string');
  const parsedQueries = queryString.parse(location.search);
  const queries = {
    c: parsedQueries.c,
    t: parsedQueries.t,
    key: parseInt(parsedQueries.key, 10),
    symbol: parsedQueries.symbol,
  };
  SongPageElement.setAttribute(':queries', JSON.stringify(queries));

  // タイトル
  const titleElement = document.getElementsByClassName('title')[0];
  let title: string;
  if (typeof titleElement === 'undefined') {
    title = '';
  } else {
    // @ts-ignore
    title = titleElement.innerText;
  }
  SongPageElement.setAttribute('title', title);

  // サブタイトル
  const subtitleElement = document.getElementsByClassName('subtitle')[0];
  let subtitle: string;
  if (typeof subtitleElement === 'undefined') {
    subtitle = '';
  } else {
    // @ts-ignore
    subtitle = subtitleElement.innerText;
  }
  SongPageElement.setAttribute('subtitle', subtitle);

  // タグ
  const tags = [];
  const tagElements = document.querySelectorAll('.tag a[itemprop=keywords]');
  for (const tagElement of tagElements) {
    // @ts-ignore
    tags.push(tagElement.innerText);
  }
  SongPageElement.setAttribute(':tags', JSON.stringify(tags));

  // コード譜
  const chordpro = await axios.get(`wiki.cgi?c=edit&t=${queries.t}`).then((res) => {
    return parse(res.data).querySelector('textarea').text;
  });
  const parseedChordpro = parseChordpro(chordpro);
  SongPageElement.setAttribute(':parseed-chordpro', JSON.stringify(parseedChordpro.lines));

  // YouTubeリンク
  const matchedYouTubeId = document.body.innerHTML.match(/href=\"https\:\/\/www\.youtube\.com\/watch\?v=(.+?)\"/);

  const info = await axios.get(`wiki.cgi?c=infoedit&t=${queries.t}`).then((res) => {
    const parsedHTML = parse(res.data);
    return {
      // @ts-ignore
      youtubeId: parsedHTML.querySelector('[name="youtube"]')._attrs.value,
      // @ts-ignore
      nicoVideoId: parsedHTML.querySelector('[name="niconico"]')._attrs.value,
      // @ts-ignore
      asin: parsedHTML.querySelector('[name="asin"]')._attrs.value,
      // @ts-ignore
      itunes: parsedHTML.querySelector('[name="itunes"]')._attrs.value,
      // @ts-ignore
      jasrac: parsedHTML.querySelector('[name="jasrac"]')._attrs.value,
    };
  });
  SongPageElement.setAttribute('youtube-id', info.youtubeId || parseedChordpro.meta.youtubeId);
  SongPageElement.setAttribute('nico-video-id', info.nicoVideoId || parseedChordpro.meta.nicoVideoId);

  document.body.innerHTML = SongPageElement.outerHTML;

  new Vue({
    el: '#chordwiki-plus-song-page',
    store: store,
    components: {
      SongPage,
    },
  });

  store.dispatch('config/restoreFromLocalStorage');
}

main();
