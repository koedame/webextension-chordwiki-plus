<template lang="pug">
.chordwiki-plus-custom-header
  b-navbar
    template(slot='brand')
      b-navbar-item(tag='a', href="/")
        img(src='https://ja.chordwiki.org/logo.jpg')
    template(slot='start')
      b-navbar-item(tag="div")
        form(@submit.prevent="onSearch")
          b-field
            b-input.search-input(placeholder="キーワードを入力", type='search', size="is-small", v-model="searchKeyword")
            .control
              b-button(size="is-small", type="is-info", @click="onSearch")
                | 検索

    template(slot='end')
      b-navbar-item(href='https://ja.chordwiki.org/ranking.html')
        | ランキング
      b-navbar-item(href='https://ja.chordwiki.org/wiki.cgi?c=history')
        | 閲覧履歴
      b-navbar-item(:href="`https://ja.chordwiki.org/wiki.cgi?c=edit&t=${queries.t}`")
        | 編集
      b-navbar-item(:href="`https://ja.chordwiki.org/wiki.cgi?c=log&t=${queries.t}`")
        | 履歴
      b-navbar-item(:href="`https://ja.chordwiki.org/wiki.cgi?c=note&t=${queries.t}`")
        | ノート
      b-navbar-item(:href="`https://ja.chordwiki.org/wiki.cgi?c=rating&t=${queries.t}`")
        | 評価
      b-navbar-item(:href="`https://ja.chordwiki.org/wiki.cgi?c=addlist&t=${queries.t}`")
        | セトリ登録

      //- b-navbar-dropdown(label='その他')
      //-   b-navbar-item(href='https://ja.chordwiki.org/random.cgi')
      //-     | ランダム
      //-   b-navbar-item(href='https://ja.chordwiki.org/cd.html')
      //-     | コードブック
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
      searchKeyword: '',
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
    onSearch() {
      location.href = `https://ja.chordwiki.org/search.html#gsc.q=${this.searchKeyword}`;
    },
  },
};
</script>

<style lang="sass">
.chordwiki-plus-custom-header
  @import "~bulma/sass/utilities/_all"
  @import "~bulma"
  @import "~buefy/src/scss/buefy"

  .search-input
    min-width: 170px
</style>
