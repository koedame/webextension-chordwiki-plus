<template lang="pug">
#chordwiki-plus-song-page
  CustomHeader
  .container
    .section
      h1.title {{title}}
      h2.subtitle {{subtitle}}

      SongTags(:tags="tags")

      YouTubeEmbedPlayer(:youtube-id="youtubeId", v-if="youtubeId")
      NicoVideoEmbedPlayer(:nico-video-id="nicoVideoId", v-if="nicoVideoId")

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
          b-button(v-if="isCopied", size="is-small", @click="copyUrl", type="is-success")
            | ✔ コピーしました

          b-button(v-else,size="is-small", @click="copyUrl")
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

  CustomFooter
  ChangeAutoScrollSpeedButton
  ScrollAfterimage
</template>

<script>
import queryString from 'query-string';

import CustomHeader from '../components/CustomHeader';
import SongTags from '../components/SongTags';
import CustomFooter from '../components/CustomFooter';
import ChangeAutoScrollSpeedButton from '../components/ChangeAutoScrollSpeedButton';
import ScrollAfterimage from '../components/ScrollAfterimage';
import SongMenu from '../components/SongMenu';
import YouTubeEmbedPlayer from '../components/YouTubeEmbedPlayer';
import NicoVideoEmbedPlayer from '../components/NicoVideoEmbedPlayer';
import Metronome from '../components/Metronome';

import transeposeTables from '../../lib/transepose_tables';
import notationTables from '../../lib/notation_tables';

export default {
  components: {
    CustomHeader,
    SongTags,
    CustomFooter,
    ChangeAutoScrollSpeedButton,
    ScrollAfterimage,
    SongMenu,
    YouTubeEmbedPlayer,
    NicoVideoEmbedPlayer,
    Metronome,
  },
  props: {
    title: {
      type: String,
      required: false,
    },
    subtitle: {
      type: String,
      required: false,
    },
    tags: {
      type: Array,
      required: false,
    },
    parseedChordpro: {
      type: Array,
      required: false,
    },
    youtubeId: {
      type: String,
      required: false,
    },
    nicoVideoId: {
      type: String,
      required: false,
    },
    queries: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      q: {
        c: this.queries.c,
        t: this.queries.t,
        key: this.queries.key,
        symbol: this.queries.symbol,
      },

      transeposeTables: transeposeTables,

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
    };
  },
  mounted() {},

  computed: {
    transeposedParseChordproLines() {
      // オリジナルのデータを参照して破壊しないようにする
      const parseChordproLines = JSON.parse(JSON.stringify(this.parseedChordpro));

      const parseChordproLinesLength = parseChordproLines.length;
      for (let i = 0; i < parseChordproLinesLength; i++) {
        if (parseChordproLines[i].type === 'key') {
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
      const stringifiedQuery = queryString.stringify(this.q);

      const nextUrl = `https://ja.chordwiki.org/wiki.cgi?${stringifiedQuery}`;

      window.history.replaceState(null, null, nextUrl);
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
};
</script>

<style lang="sass">
@import "~bulma/sass/utilities/_all"
$navbar-breakpoint: $tablet
@import "~bulma"
@import "~buefy/src/scss/buefy"

.♣
  color: darkgreen
.♠
  color: mediumblue
.♥
  color: deeppink
.♦
  color: darkorange

.current-url
  max-width: 410px
  width: 100%


.chord-and-lyrics
  display: inline-block
  margin-right: 10px
  margin-bottom: 5px
  vertical-align: bottom
  .chord-diagram
    filter: invert(22%) sepia(100%) saturate(1164%) hue-rotate(181deg) brightness(100%) contrast(100%)

    img
      display: inline-block
      transform: rotate(-90deg)
  .chord
    display: block
    color: #3273dc
    font-weight: bold
    font-size: 14px
    line-height: 20px
    height: 20px
  .lyrics
    margin-left: 5px
    display: block
    font-weight: bold
    line-height: 20px
    height: 20px

.empty-line
  height: 2em

.key
  background: #f14668
  border-radius: 2px
  color: #fff
  padding: 0 8px
  font-weight: bold
  display: inline-block
  font-size: 14px
  margin: 10px 0

.comment
  background: #e6e6e6
  border-radius: 2px
  padding: 0 8px
  font-weight: bold
  display: inline-block
  font-size: 14px
  margin: 10px 0

.comment-italic
  background: #e6e6e6
  border-radius: 2px
  padding: 0 8px
  font-weight: bold
  display: inline-block
  font-size: 14px
  margin: 10px 0
  font-style: italic
</style>
