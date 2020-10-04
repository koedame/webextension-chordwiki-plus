<template lang="pug">
b-navbar(fixed-top, shadow)
  template(slot='brand')
    b-navbar-item(tag='router-link', :to="{name: 'home'}")
      img(src='https://ja.chordwiki.org/logo.jpg')
  template(slot='start')
    b-navbar-item(tag="div")
      form(@submit.prevent="onSearch")
        b-field
          //- TODO: 検索ワードを維持したい
          b-input.search-input(placeholder="キーワードを入力", type='search', size="is-small", v-model="searchKeyword", icon="search")
          .control
            b-button(size="is-small", @click="onSearch")
              | 検索
    b-navbar-item(href='https://ja.chordwiki.org/ranking.html')
      b-icon(icon="chart-line", type="is-success")
      span
        |
        | ランキング
    b-navbar-item(href='https://ja.chordwiki.org/wiki.cgi?c=history')
      b-icon(icon="history", type="is-info")
      span
        |
        | 閲覧履歴
  template(slot='end')
    b-navbar-dropdown(label='楽曲メニュー', right)
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

<style lang="sass" scoped>
.search-input
  min-width: calc(100vw - 700px)
</style>
