<template lang="pug">
.chordwiki-plus-song-tags
  .buttons
    b-button(v-for="tag in tags", :key="tag", tag="a", :href="`https://ja.chordwiki.org/tag/${tag}`", type="is-light", size="is-small")
      | {{tag}}
    b-button(type="is-text", tag="a", :href="`https://ja.chordwiki.org/wiki.cgi?c=tagedit&t=${queries.t}`", size="is-small")
      | タグを編集
</template>

<script>
import queryString from 'query-string';

export default {
  props: {
    tags: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      queries: {
        c: '',
        t: '',
        key: 0,
        symbol: '',
      },
    };
  },
  mounted() {
    const parsedQueries = queryString.parse(location.search);
    this.queries.c = parsedQueries.c;
    this.queries.t = parsedQueries.t;
    this.queries.key = parseInt(parsedQueries.key, 10);
    this.queries.symbol = parsedQueries.symbol;
  },
};
</script>

<style lang="sass">
.chordwiki-plus-song-tags
  @import "~bulma/sass/utilities/_all"
  @import "~bulma"
  @import "~buefy/src/scss/buefy"

  margin-bottom: 1em

h1.title
  text-align: left
h2.subtitle
  text-align: left
</style>
