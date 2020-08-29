<template lang="pug">
#chordwiki-plus-song-menu
  hr

  b-field
    | 表記：
    template(v-for='symbol in symbols')
      b-radio-button(
        v-if="symbol.value === ''",
        :key="`symbol-${symbol.name}`",
        v-model='queries.symbol',
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
        v-model='queries.symbol',
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
        v-model='queries.key',
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
        v-model='queries.key',
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

  b-field
    b-switch(type="is-info", size="is-small", @input="onChangeChordDiagram") コードダイアグラム
</template>

<script>
import queryString from 'query-string';

export default {
  data() {
    return {
      configChordDiagram: false,
      queries: {
        c: '',
        t: '',
        key: 0,
        symbol: '',
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
    };
  },
  mounted() {
    const parsedQueries = queryString.parse(location.search);
    this.queries.c = parsedQueries.c;
    this.queries.t = parsedQueries.t;
    this.queries.key = parseInt(parsedQueries.key, 10);
    this.queries.symbol = parsedQueries.symbol;

    this.configChordDiagram = this.$store.getters['config/chordDiagram'];
  },

  methods: {
    onChangeChordDiagram(value) {
      this.configChordDiagram = value;
      this.$store.dispatch('config/setChordDiagram', value);
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
      const stringifiedQuery = queryString.stringify(this.queries);

      const nextUrl = `https://ja.chordwiki.org/wiki.cgi?${stringifiedQuery}`;

      location.replace(nextUrl);
    },
  },

  destroyed: () => {
    clearInterval(this.copyTimer);
  },
};
</script>

<style lang="sass">
#chordwiki-plus-song-menu
  @import "~bulma/sass/utilities/_all"
  @import "~bulma"
  @import "~buefy/src/scss/buefy"

  .current-url
    max-width: 410px
    width: 100%
</style>
