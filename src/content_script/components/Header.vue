<template lang="pug">
b-navbar(fixed-top, shadow)
  template(slot='brand')
    b-navbar-item(tag='router-link', :to="{name: 'home'}")
      img(:src='logoLink')
  template(slot='start')
    b-navbar-item(tag="div")
      form(@submit.prevent="onSearch")
        b-field
          //- TODO: 検索ワードを維持したい
          b-input.search-input(placeholder="キーワードを入力", type='search', size="is-small", v-model="searchKeyword", icon="search")
          .control
            b-button(size="is-small", @click="onSearch")
              | 検索

    b-navbar-item(tag="router-link", :to='{name: "ranking"}')
      b-icon(icon="chart-line", type="is-success")
      span
        |
        | ランキング
    b-navbar-item(href='https://ja.chordwiki.org/wiki.cgi?c=editlist')
      b-icon(icon="th-list", type="is-warning")
      span
        |
        | マイセットリスト

  template(slot='end')
    b-navbar-dropdown(label='その他', right)
      b-navbar-item(href='https://ja.chordwiki.org/wiki.cgi?c=history') 閲覧履歴
      b-navbar-item(href='https://ja.chordwiki.org/new.html') 新規作成
      b-navbar-item(tag="router-link", :to='{name: "song", query: {c: "view", key: "0", symbol: "", t: "練習用"}}') 練習ページ
      b-navbar-item(href='https://ja.chordwiki.org/cd.html') コードブック
      b-navbar-item(href='https://ja.chordwiki.org/list/1.html') 楽曲一覧
      b-navbar-item(href='https://ja.chordwiki.org/help.html') ヘルプ
</template>

<script>
const contentBrowser = require('webextension-polyfill');

export default {
  data() {
    return {
      logoLink: contentBrowser.extension.getURL('/images/logo@2x.png'),

      searchKeyword: '',
    };
  },
  mounted() {
    document.body.classList.add('has-navbar-fixed-top');
  },
  methods: {
    onSearch() {
      location.href = `https://ja.chordwiki.org/search.html#gsc.q=${encodeURIComponent(this.searchKeyword)}`;
    },
  },
};
</script>

<style lang="sass" scoped>
.search-input
  min-width: calc(100vw - 700px)
</style>
