<template lang="pug">
#song-menu--custom
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
        @input="onChangeSymbol",
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
        @input="onChangeSymbol",
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
        @input="onTransposeKey",
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
        @input="onTransposeKey",
        size="is-small"
      )
        span
          | {{ transposeKey.name }}

  hr
</template>

<script>
const queryString = require('query-string');

export default {
  data() {
    return {
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
    };
  },
  mounted() {
    const parsedQueries = queryString.parse(location.search);
    this.queries.c = parsedQueries.c;
    this.queries.t = parsedQueries.t;
    this.queries.key = parseInt(parsedQueries.key, 10);
    this.queries.symbol = parsedQueries.symbol;
  },

  methods: {
    onTransposeKey(value) {
      const stringifiedQuery = queryString.stringify(this.queries);
      // TODO: 再読み込みが発生しないように非同期でページを書き換えたい
      location.replace(`https://ja.chordwiki.org/wiki.cgi?${stringifiedQuery}`);
    },

    onChangeSymbol(value) {
      const stringifiedQuery = queryString.stringify(this.queries);
      // TODO: 再読み込みが発生しないように非同期でページを書き換えたい
      location.replace(`https://ja.chordwiki.org/wiki.cgi?${stringifiedQuery}`);
    },
  },
};
</script>

<style lang="sass">
#song-menu--custom
  @import "~bulma/sass/utilities/_all"
  @import "~bulma"
  @import "~buefy/src/scss/buefy"
</style>
