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

function parseChordpro(chordpro: string) {
  let meta = {
    title: '',
    subtitle: '',
    youtubeId: '',
    nicoVideoId: '',
    // links: [],
  };

  let lines = [];
  const splittedLines = chordpro.replace(/\r/g, '').split('\n');
  for (let i = 0; i < splittedLines.length; i++) {
    let line = splittedLines[i];

    if (line === '') {
      if (i !== 0) {
        lines.push({ type: 'emptyLine' });
      }
      continue;
    }

    // {title:タイトル}
    // {t:タイトル}
    // 歌のタイトルを入れます。
    const matchedTitle = line.match(/^\{(title|t|TITLE|T)\:(.+?)\}/);
    if (matchedTitle) {
      meta['title'] = matchedTitle[2];
      continue;
    }

    // {subtitle:サブタイトル}
    // {st:サブタイトル}
    // アーティスト名などを入れます。
    const matchedSubtitle = line.match(/^\{(subtitle|st|SUBTITLE|ST)\:(.+?)\}/);
    if (matchedSubtitle) {
      meta['title'] = matchedSubtitle[2];
      continue;
    }

    // {comment:コメント}
    // {c:コメント}
    // コメントを入れます。（表示されます。）
    const matchedComment = line.match(/^\{(comment|c|COMMENT|C)\:(.+?)\}/);
    if (matchedComment) {
      const matchedBPM = matchedComment[2].match(/(BPM.([0-9]+))/);
      const queryString = require('query-string');

      matchedComment[2] = matchedComment[2]
        .replace(/</g, '&lt')
        .replace(/>/g, '&gt')
        .replace(/(♣|♠|♥|♦)/g, '<span class="$1">$1</span>')
        .replace(/(移調\+[0-9]|移調\-[0-9]|移調[:： 　]\+[0-9]|移調[:： 　]\-[0-9])/g, (match) => {
          const parsedQueries = queryString.parse(location.search);
          const key = parseInt(match.replace(/[^0-9\-]/g, ''), 10);
          const queries = {
            c: parsedQueries.c,
            t: parsedQueries.t,
            key: key,
            symbol: parsedQueries.symbol,
          };

          const stringifiedQuery = queryString.stringify(queries);
          const url = `https://ja.chordwiki.org/wiki.cgi?${stringifiedQuery}`;
          return `<a href="${url}">${match}</a>`;
        });

      if (matchedBPM) {
        lines.push({ type: 'comment', data: matchedComment[2], bpm: parseInt(matchedBPM[2]) });
      } else {
        lines.push({ type: 'comment', data: matchedComment[2] });
      }
      continue;
    }

    // {comment_italic:コメント}
    // {ci:コメント}
    // コメントを入れます。（イタリック表示）
    const matchedCommentItalic = line.match(/^\{(comment_italic|ci|COMMENT_ITALIC|CI)\:(.+?)\}/);
    if (matchedCommentItalic) {
      const matchedBPM = matchedCommentItalic[2].match(/(BPM.([0-9]+))/);

      matchedCommentItalic[2] = matchedCommentItalic[2]
        .replace(/</g, '&lt')
        .replace(/>/g, '&gt')
        .replace(/(♣|♠|♥|♦)/g, '<span class="$1">$1</span>')
        .replace(/(移調\+[0-9]|移調\-[0-9]|移調[:： 　]\+[0-9]|移調[:： 　]\-[0-9])/g, (match) => {
          const parsedQueries = queryString.parse(location.search);
          const key = parseInt(match.replace(/[^0-9\-]/g, ''), 10);
          const queries = {
            c: parsedQueries.c,
            t: parsedQueries.t,
            key: key,
            symbol: parsedQueries.symbol,
          };

          const stringifiedQuery = queryString.stringify(queries);
          const url = `https://ja.chordwiki.org/wiki.cgi?${stringifiedQuery}`;
          return `<a href="${url}">${match}</a>`;
        });

      if (matchedBPM) {
        lines.push({ type: 'commentItalic', data: matchedCommentItalic[2], bpm: parseInt(matchedBPM[2]) });
      } else {
        lines.push({ type: 'commentItalic', data: matchedCommentItalic[2] });
      }
      continue;
    }

    // #コメント
    // コメントを入れます。（表示されません）
    const matchedHiddenComment = line.match(/^#(.+?)$/);
    if (matchedHiddenComment) {
      lines.push({ type: 'hiddenComment', data: matchedHiddenComment[2] });
      continue;
    }

    // {key:キー}
    // （移調前の）キーを記入します。
    const matchedKey = line.match(/^\{(key|KEY)\:(.+?)\}/);
    if (matchedKey) {
      lines.push({ type: 'key', data: matchedKey[2].replace(/[b\-]/g, '♭').replace(/[#\+]/g, '♯') });
      continue;
    }

    // {redirect:ページ名}
    // 別のページに転送します。
    const matchedRedirect = line.match(/^\{(redirect|REDIRECT)\:(.+?)\}/);
    if (matchedRedirect) {
      // TODO
      continue;
    }

    // {asin:アマゾン商品コード}
    // Amazon.co.jp の商品を指定します。※楽曲情報編集により上書きされます。
    const matchedAmazonProductCode = line.match(/^\{(asin|ASIN)\:(.+?)\}/);
    if (matchedAmazonProductCode) {
      // TODO
      continue;
    }

    // {youtube:〜}
    // YouTube のビデオIDを指定します。※楽曲情報編集により上書きされます。
    const matchedYouTubeId = line.match(/^\{(youtube|YOUTUBE)\:(.+?)\}/);
    if (matchedYouTubeId) {
      meta.youtubeId = matchedYouTubeId[2];
      continue;
    }

    // {nicovideo:sm〜}
    // ニコニコ動画の動画IDを指定します。※楽曲情報編集により上書きされます。
    const matchedNicoVideoId = line.match(/^\{(nicovideo|NICOVIDEO)\:(.+?)\}/);
    if (matchedNicoVideoId) {
      meta.nicoVideoId = matchedNicoVideoId[2];
      continue;
    }

    // {mp3:http://〜.mp3}
    // MP3ファイルを指定します。
    const matchedMP3 = line.match(/^\{(mp3|MP3)\:(.+?)\}/);
    if (matchedMP3) {
      // TODO
      continue;
    }

    // {http(s)://〜}
    // 楽曲情報としてリンクを表示します。（行の途中では不可）
    const matchedHttpLink = line.match(/^\{((http|HTTP):\/\/.+?)\}/);
    if (matchedHttpLink) {
      // TODO
      continue;
    }

    // {http(s)://〜}
    // 楽曲情報としてリンクを表示します。（行の途中では不可）
    const matchedHttpsLink = line.match(/^\{((https|HTTPS):\/\/.+?)\}/);
    if (matchedHttpsLink) {
      // TODO
      continue;
    }

    // {リンクテキスト>http(s)://〜}
    // 楽曲情報としてリンクを表示します。（行の途中では不可）
    const matchedHttpLinkedText = line.match(/^\{(.*?)\>((http|HTTP):\/\/.+?)\}/);
    if (matchedHttpLinkedText) {
      // meta.links.push({
      //   text: matchedHttpLinkedText[1],
      //   url: matchedHttpLinkedText[2],
      // });
      continue;
    }

    // {リンクテキスト>http(s)://〜}
    // 楽曲情報としてリンクを表示します。（行の途中では不可）
    const matchedHttpsLinkedText = line.match(/^\{(.*?)\>((https|HTTPS):\/\/.+?)\}/);
    if (matchedHttpsLinkedText) {
      // meta.links.push({
      //   text: matchedHttpsLinkedText[1],
      //   url: matchedHttpsLinkedText[2],
      // });
      continue;
    }

    let splittedChordAndLyrics = [];
    for (const l of line.split('[')) {
      // let tempLyrics: string;
      let res = {
        chord: '',
        lyrics: '',
      };

      const ll = l.match(/(.*?)\](.*?)$/);
      const lll = l.match(/(.*?)\]$/);

      if (ll) {
        res.chord = ll[1];
        res.lyrics = ll[2];
      } else if (lll) {
        res.chord = lll[1];
        // res.lyrics =
      } else {
        // res.chord =
        res.lyrics = l;
      }

      res.chord = res.chord.replace(/[b]/g, '♭').replace(/[#]/g, '♯');

      res.lyrics = res.lyrics
        .replace(/</g, '&lt')
        .replace(/>/g, '&gt')
        .replace(/(♣|♠|♥|♦)/g, '<span class="$1">$1</span>');

      if (res.chord === '' && res.lyrics === '') {
      } else {
        splittedChordAndLyrics.push(res);
      }
    }

    lines.push({ type: 'chordAndLyrics', data: splittedChordAndLyrics });
  }

  return { meta, lines };
}

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
