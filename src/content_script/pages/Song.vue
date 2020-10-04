<template lang="pug">
#chordwiki-plus-song-page
  CustomHeader
  .container
    .section
      h1.title
        b-skeleton(v-if="isLoading", height="36px")
        template(v-else)
          | {{parseedChordpro.meta.title}}
      h2.subtitle
        b-skeleton(v-if="isLoading", height="25px")
        template(v-else)
          | {{parseedChordpro.meta.subtitle}}

      .chordwiki-plus-song-page-tags
        .buttons
          b-button(v-for="tag in tags", :key="tag", tag="a", :href="`https://ja.chordwiki.org/tag/${tag}`", type="is-light", size="is-small", icon-left="tag")
            | {{tag}}
          b-button(type="is-text", tag="a", :href="`https://ja.chordwiki.org/wiki.cgi?c=tagedit&t=${q.t}`", size="is-small", icon-left="pen")
            | タグを編集

      b-skeleton(v-if="isLoading", height="150px")
      template(v-else)
        YouTubeEmbedPlayer(:youtube-id="youtubeId", v-if="youtubeId !== ''")
        NicoVideoEmbedPlayer(:nico-video-id="nicoVideoId", v-if="nicoVideoId !== ''")

      b-button(size="is-small", type="is-text", tag="a", :href="`https://ja.chordwiki.org/wiki.cgi?c=infoedit&t=${q.t}`", icon-left="pen") 動画を設定編集

      hr

      b-field
        | 表記：
        template(v-for='symbol in symbols')
          b-radio-button(
            v-if="symbol.value === ''",
            :key="`symbol-${symbol.name}`",
            v-model='q.symbol',
            :native-value='symbol.value',
            type='is-info',
            @input="onChangeQueries",
            size="is-small"
          )
            span
              | {{ symbol.name }}

          b-radio-button(
            v-else,
            :key="`symbol-${symbol.name}`",
            v-model='q.symbol',
            :native-value='symbol.value',
            type='is-danger',
            @input="onChangeQueries",
            size="is-small"
          )
            span
              | {{ symbol.name }}

      b-field
        | 移調：
        template(v-for='transposeKey in transposeKeys')
          b-radio-button(
            v-if="transposeKey.value === 0",
            :key="`transposeKey-${transposeKey.name}`",
            v-model='q.key',
            :native-value='transposeKey.value',
            type='is-info',
            @input="onChangeQueries",
            size="is-small"
          )
            span
              | {{ transposeKey.name }}
          b-radio-button(
            v-else,
            :key="`transposeKey-${transposeKey.name}`",
            v-model='q.key',
            :native-value='transposeKey.value',
            type='is-danger',
            @input="onChangeQueries",
            size="is-small"
          )
            span
              | {{ transposeKey.name }}

      b-field(label-position='on-border')
        b-input.current-url(readonly, size="is-small", v-model="currentUrl", ref="urlInputTag")
        p.control
          b-button(v-if="isCopied", size="is-small", @click="copyUrl", type="is-success", icon-left="clipboard-check")
            | コピーしました

          b-button(v-else,size="is-small", @click="copyUrl", icon-left="clipboard")
            | URLをコピー

      hr

      b-field(grouped)
        .control
          b-switch(v-model="$store.state.config.chordDiagram", type="is-info", size="is-small", @input="onChangeChordDiagram")
            | コードダイアグラム

        .control
          b-switch(v-model="$store.state.config.scrollGuide", type="is-info", size="is-small", @input="onChangeScrollGuide")
            | スクロールガイド

      #chordwiki-plus-lyrics
        b-skeleton(v-if="isLoading", size="is-medium", :count="100")
        template(v-else)
          div(v-for="line in transeposedParseChordproLines")
            template(v-if="line.type === 'chordAndLyrics'")
              span.chord-and-lyrics(v-for="data in line.data")
                span.chord-diagram(v-if="$store.state.config.chordDiagram")
                  img(:src="data.chordDiagram")
                span.chord(v-else)
                  | {{data.chord}}
                span.lyrics(v-html="sanitizeHTML(data.lyrics)")

            template(v-else-if="line.type === 'comment'")
              .comment(v-if="line.bpm")
                Metronome(:bpm="line.bpm")
                span(v-html="line.data")
              .comment(v-else)
                span(v-html="line.data")

            template(v-else-if="line.type === 'commentItalic'")
              .comment-italic(v-if="line.bpm")
                Metronome(:bpm="line.bpm")
                | {{line.data}}
              .comment-italic
                | {{line.data}}

            template(v-else-if="line.type === 'key'")
              .key(v-if="q.key === 0")
                | キー：{{line.data}}
              .key(v-else)
                | キー：{{line.transeposedKey}} （移調前：{{line.data}}）

            template(v-else-if="line.type === 'emptyLine'")
              .empty-line

            template(v-else-if="line.type === 'hiddenComment'")

            template(v-else)
              div
                | {{line}}

  ChangeAutoScrollSpeedButton
  ScrollAfterimage
</template>

<script>
import axios from 'axios';
import { parse } from 'node-html-parser';

import CustomHeader from '../components/CustomHeader';
import ChangeAutoScrollSpeedButton from '../components/ChangeAutoScrollSpeedButton';
import ScrollAfterimage from '../components/ScrollAfterimage';
import SongMenu from '../components/SongMenu';
import YouTubeEmbedPlayer from '../components/YouTubeEmbedPlayer';
import NicoVideoEmbedPlayer from '../components/NicoVideoEmbedPlayer';
import Metronome from '../components/Metronome';

import transeposeTables from '../../lib/transepose_tables';
import notationTables from '../../lib/notation_tables';
import parseChordpro from '../../lib/parse_chordpro';

export default {
  components: {
    CustomHeader,
    ChangeAutoScrollSpeedButton,
    ScrollAfterimage,
    SongMenu,
    YouTubeEmbedPlayer,
    NicoVideoEmbedPlayer,
    Metronome,
  },
  data() {
    return {
      q: {
        c: 'view',
        t: '',
        key: 0,
        symbol: '',
      },

      tags: [],

      info: {
        youtubeId: '',
        nicoVideoId: '',
        asin: '',
        itunes: '',
        jasrac: '',
      },

      parseedChordpro: {
        lines: [],
        meta: {
          title: '',
          subtitle: '',
          youtubeId: '',
          nicoVideoId: '',
        },
      },

      transposeKeys: [...Array(12).keys()].map((i) => {
        const num = ++i - 6;

        const res = {
          name: '',
          value: num,
        };

        if (num > 0) {
          res.name = `+${num}`;
        } else {
          res.name = `${num}`;
        }

        return res;
      }),

      symbols: [
        { name: '♭表記', value: 'flat' },
        { name: '指定なし', value: '' },
        { name: '♯表記', value: 'sharp' },
      ],

      currentUrl: location.href,

      isCopied: false,
      copyTimer: null,
      isLoading: true,
    };
  },
  watch: {
    // ブラウザバック時に更新されるように処理を入れる
    $route(to, from) {
      this.q.t = to.query.t;
      this.q.key = parseInt(to.query.key, 10);
      this.q.symbol = to.query.symbol;
    },
  },

  mounted() {
    this.q.t = this.$route.query.t;
    this.q.key = parseInt(this.$route.query.key, 10);
    this.q.symbol = this.$route.query.symbol;

    Promise.all([
      // タグ
      axios.get(`wiki.cgi?c=tagedit&t=${this.q.t}`).then((res) => {
        this.tags = parse(res.data).querySelector('textarea').text.split('\n');
      }),

      // chordpro
      axios.get(`wiki.cgi?c=edit&t=${this.q.t}`).then((res) => {
        // <や>などが実体参照になっていなくてパースがうまくいかないので正規表現に頼る
        // 複数行にマッチさせると指定範囲の取り出しができないので、replaceで不要な部分を削除している
        const chordpro = res.data
          .match(/<textarea name="chord" cols="120" rows="36">[\s\S]*?<\/textarea>/g)[0]
          .replace('<textarea name="chord" cols="120" rows="36">', '')
          .replace('</textarea>', '');
        this.parseedChordpro = parseChordpro(chordpro);
      }),

      // link
      axios.get(`wiki.cgi?c=infoedit&t=${this.q.t}`).then((res) => {
        const parsedHTML = parse(res.data);

        if (parsedHTML.querySelector('[name="youtube"]')._attrs.value !== '') {
          this.info.youtubeId = parsedHTML.querySelector('[name="youtube"]')._attrs.value;
        }

        if (parsedHTML.querySelector('[name="niconico"]')._attrs.value !== '') {
          this.info.nicoVideoId = parsedHTML.querySelector('[name="niconico"]')._attrs.value;
        }

        if (parsedHTML.querySelector('[name="asin"]')._attrs.value !== '') {
          this.info.asin = parsedHTML.querySelector('[name="asin"]')._attrs.value;
        }

        if (parsedHTML.querySelector('[name="itunes"]')._attrs.value !== '') {
          this.info.itunes = parsedHTML.querySelector('[name="itunes"]')._attrs.value;
        }

        if (parsedHTML.querySelector('[name="jasrac"]')._attrs.value !== '') {
          this.info.jasrac = parsedHTML.querySelector('[name="jasrac"]')._attrs.value;
        }
      }),
    ]).then((res) => {
      this.isLoading = false;
    });
  },

  computed: {
    youtubeId() {
      if (this.info.youtubeId !== '') {
        return this.info.youtubeId;
      } else if (this.parseedChordpro.meta.youtubeId !== '') {
        return this.parseedChordpro.meta.youtubeId;
      } else {
        return '';
      }
    },
    nicoVideoId() {
      if (this.info.nicoVideoId !== '') {
        return this.info.nicoVideoId;
      } else if (this.parseedChordpro.meta.nicoVideoId !== '') {
        return this.parseedChordpro.meta.nicoVideoId;
      } else {
        return '';
      }
    },
    transeposedParseChordproLines() {
      // オリジナルのデータを参照して破壊しないようにする
      const parseChordproLines = JSON.parse(JSON.stringify(this.parseedChordpro.lines));

      const parseChordproLinesLength = parseChordproLines.length;
      for (let i = 0; i < parseChordproLinesLength; i++) {
        if (parseChordproLines[i].type === 'key') {
          if (this.q.symbol === 'flat') {
            parseChordproLines[i].data = parseChordproLines[i].data.replace(/^(A♭|A♯|A|B♭|B♯|B|C♭|C♯|C|D♭|D♯|D|E♭|E♯|E|F♭|F♯|F|G♭|G♯|G)$/g, function (match) {
              return notationTables.toFlat[match];
            });
          } else if (this.q.symbol === 'sharp') {
            parseChordproLines[i].data = parseChordproLines[i].data.replace(/^(A♭|A♯|A|B♭|B♯|B|C♭|C♯|C|D♭|D♯|D|E♭|E♯|E|F♭|F♯|F|G♭|G♯|G)$/g, function (match) {
              return notationTables.toSharp[match];
            });
          }

          if (this.q.key !== 0) {
            // 移調
            const matchedKeys = parseChordproLines[i].data.match(/^(.*?)(A♭|A♯|A|B♭|B♯|B|C♭|C♯|C|D♭|D♯|D|E♭|E♯|E|F♭|F♯|F|G♭|G♯|G)(.*?)$/);

            let transeposedKey = matchedKeys[2];

            transeposedKey = transeposeTables[this.q.key][transeposedKey];

            if (this.q.symbol === 'flat') {
              transeposedKey = notationTables.toFlat[transeposedKey];
            } else if (this.q.symbol === 'sharp') {
              transeposedKey = notationTables.toSharp[transeposedKey];
            }

            parseChordproLines[i].transeposedKey = `${matchedKeys[1]}${transeposedKey}${matchedKeys[3]}`;
          }
        }

        if (parseChordproLines[i].type === 'chordAndLyrics') {
          const parseChordproLinesDataLength = parseChordproLines[i].data.length;
          for (let ii = 0; ii < parseChordproLinesDataLength; ii++) {
            if (parseChordproLines[i].data[ii].chord === '') {
              continue;
            }

            if (parseChordproLines[i].data[ii].chord.toUpperCase().replace(/[^A-Z]/g, '') === 'NC') {
              parseChordproLines[i].data[ii].chordDiagram = '/cd/N.C..png';
              continue;
            }

            parseChordproLines[i].data[ii].chord = parseChordproLines[i].data[ii].chord.replace(
              /(A♭|A♯|A|B♭|B♯|B|C♭|C♯|C|D♭|D♯|D|E♭|E♯|E|F♭|F♯|F|G♭|G♯|G)/g,
              (match, index, originalString) => {
                // 移調
                if (this.q.key !== 0) {
                  match = transeposeTables[this.q.key][match];
                }
                // 表記変更
                if (this.q.symbol === 'flat') {
                  match = notationTables.toFlat[match];
                } else if (this.q.symbol === 'sharp') {
                  match = notationTables.toSharp[match];
                }
                return match;
              }
            );

            parseChordproLines[i].data[ii].chordDiagram =
              '/cd/' + parseChordproLines[i].data[ii].chord.replace(/M/g, 'maj').replace(/♯/g, 's').replace(/♭/g, 'b').replace(/\//g, 'on') + '.png';
          }
        }
      }
      return parseChordproLines;
    },
  },
  methods: {
    onChangeChordDiagram(value) {
      this.$store.dispatch('config/setChordDiagram', value);
    },
    onChangeScrollGuide(value) {
      this.$store.dispatch('config/setScrollGuide', value);
    },
    copyUrl() {
      this.$clipboard(this.currentUrl);
      this.$refs.urlInputTag.$refs.input.select();
      this.isCopied = true;

      if (this.copyTimer) {
        clearTimeout(this.copyTimer);
      }

      this.copyTimer = setTimeout(() => {
        this.isCopied = false;
      }, 3000);
    },

    onChangeQueries() {
      this.$router.replace({ name: 'song', query: this.q });
      this.currentUrl = location.href;
    },

    sanitizeHTML(text) {
      return text.replace(/<script>/g, '&ltscript&gt').replace(/<\/script>/g, '&lt/script&gt');
    },

    //   toggleAutoScroll() {
    //     if (this.$store.state.autoScroll.timer) {
    //       this.$store.dispatch('autoScroll/stopAutoScroll');
    //     } else {
    //       this.$store.dispatch('autoScroll/runAutoScroll');
    //     }
    //   },
  },
  destroyed() {
    clearInterval(this.copyTimer);

    //   if (this.$store.state.autoScroll.timer) {
    //     this.$store.dispatch('autoScroll/stopAutoScroll');
    //   }
  },

  metaInfo() {
    return {
      title: `${this.parseedChordpro.meta.title} - コード譜`,
    };
  },
};
</script>
