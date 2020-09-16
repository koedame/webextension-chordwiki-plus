<template lang="pug">
.chordwiki-plus-song-tags
  .buttons.tags__item
    b-button(v-for="tag in tags", :key="tag", tag="a", :href="`https://ja.chordwiki.org/tag/${tag}`", type="is-light")
      | {{tag}}
    b-button(type="is-text", tag="a", :href="`https://ja.chordwiki.org/wiki.cgi?c=tagedit&t=${queries.t}`")
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

  .tags__item
    justify-content: center
</style>
