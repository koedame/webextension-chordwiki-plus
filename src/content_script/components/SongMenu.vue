<template lang="pug">
#chordwiki-plus-song-menu
</template>

<script>
import queryString from 'query-string';

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

<style lang="sass" scoped>
#chordwiki-plus-song-menu
  .current-url
    max-width: 410px
    width: 100%
</style>
