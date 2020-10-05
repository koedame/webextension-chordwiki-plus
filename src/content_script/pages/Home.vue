<template lang="pug">
#chordwiki-plus-home
  section.hero.is-bold.is-info
    .hero-head
      b-navbar()
        template(slot='brand')
          b-navbar-item(tag='router-link', :to="{name: 'home'}")
            img(:src='logoInvertLink')
        template(slot='start')

        template(slot='end')
          b-navbar-item(tag="router-link", :to='{name: "ranking"}')
            b-icon(icon="chart-line")
            span
              |
              | ランキング
          b-navbar-item(href='https://ja.chordwiki.org/wiki.cgi?c=editlist')
            b-icon(icon="th-list")
            span
              |
              | マイセットリスト
          b-navbar-item(href='https://ja.chordwiki.org/wiki.cgi?c=history')
            b-icon(icon="history")
            span
              |
              | 閲覧履歴
          b-navbar-dropdown(label='その他', right)
            b-navbar-item(href='https://ja.chordwiki.org/new.html') 新規作成
            b-navbar-item(tag="router-link", :to='{name: "song", query: {c: "view", key: "0", symbol: "", t: "練習用"}}') 練習ページ
            b-navbar-item(href='https://ja.chordwiki.org/cd.html') コードブック
            b-navbar-item(href='https://ja.chordwiki.org/list/1.html') 楽曲一覧
            b-navbar-item(href='https://ja.chordwiki.org/help.html') ヘルプ

    .hero-body.has-text-centered
      .container
        h1.title
          img.hero-logo(:src='logoInvertLink')
        p
          | コード譜と歌詞を chordpro 形式で投稿・編集・保存できます。
          br
          | 現在 {{songCount}} 曲です。

      .search_box_wrap
        form(@submit.prevent="onSearch")
          b-field
            //- TODO: 検索ワードを維持したい
            b-input.search-input(placeholder="キーワードを入力", type='search', v-model="searchKeyword", icon="search", size="is-small")
            .control
              b-button(@click="onSearch", size="is-small")
                | 検索

      .buttons.tags-buttons
        span
          | 人気のタグ：
        b-button(type="is-light", v-for="tag in popularTags", tag="a", :href="tag.link", :key="tag.title", size="is-small", icon-left="tag") {{tag.title}}

  .container
    .section
      h2.title.is-5
        b-icon(icon="chart-line", type="is-success")
        |
        | 人気ランキング
      .box(v-if="rankings.length === 0")
        .media(v-for="i in 10")
          figure.media-left
            p.image.is-32x32
              b-skeleton(size="is-large", height="32px")
          .media-content
            .content
              b-skeleton
      .box(v-else)
        .media.song-list-item(v-for="song in rankings.slice(0, 10)", @click="songLinkTo(song.link)", :key="song.title")
          b-tag.rank-text {{song.rank}}

          figure.media-left
            p.image.is-32x32
              img(:src='song.thumbnail')
          .media-content
            .content
              p
                strong
                  | {{song.title}}
                |
                | {{song.subtitle}}

        .media
          b-button(tag="router-link", :to="{name: 'ranking'}", type="is-info is-light", expanded)
            | もっと見る

    .section
      h2.title.is-5
        b-icon(icon="sync-alt", type="is-warning")
        |
        | 更新楽曲
      .box(v-if="latests.length === 0")
        .media(v-for="i in 10")
          .media-content
            .content
              b-skeleton
      .box(v-else)
        .media.song-list-item(v-for="song in latests.slice(0, 10)", @click="songLinkTo(song.link)", :key="song.title")
          .media-content
            b-icon(icon="record-vinyl")
            |
            strong {{song.title}}

        .media
          b-button(tag="a", href="https://ja.chordwiki.org/list/1.html", type="is-info is-light", expanded)
            | もっと見る
</template>

<script>
import axios from 'axios';
import { parse } from 'node-html-parser';
const contentBrowser = require('webextension-polyfill');

export default {
  data() {
    return {
      logoInvertLink: contentBrowser.extension.getURL('/images/logo-invert@2x.png'),
      logoTexLink: contentBrowser.extension.getURL('/images/logo-text@2x.png'),
      searchKeyword: '',
      songCount: 0,
      rankings: [],
      latests: [],
      popularTags: [],
    };
  },
  mounted() {
    // 楽曲数
    axios.get('/count.js').then((res) => {
      this.songCount = parseInt(res.data.match(/document.write\('([0-9]+?)'\)/)[1], 10).toLocaleString();
    });

    // 楽曲数
    axios.get('/tagtrend.js').then((res) => {
      res.data.replace(/<a href="(\/tag\/.+?)">(.+?)<\/a>/g, (match, link, title) => {
        this.popularTags.push({
          link: link,
          title: title,
        });
      });
    });

    // ランキングデータ
    axios.get('/ranking.html').then((res) => {
      const parsedHTML = parse(res.data);
      const trTags = parsedHTML.querySelectorAll('.ranking tr');
      for (const trTag of trTags) {
        const link = trTag.querySelector('a');
        this.rankings.push({
          rank: trTag.querySelector('.rankno').text,
          title: link.text,
          subtitle: trTag.querySelector('.sub').text,
          link: link.attributes.href,
          thumbnail: trTag.querySelector('img').attributes.src,
        });
      }
    });

    // 新着楽曲
    axios.get('/list/1.html').then((res) => {
      res.data.replace(/<li><a href="(.+?)">(.+?)<\/a><\/li>/g, (match, link, title) => {
        this.latests.push({
          title: title,
          link: link,
        });
      });
    });
  },
  methods: {
    onSearch() {
      location.href = `https://ja.chordwiki.org/search.html#gsc.q=${this.searchKeyword}`;
    },
    songLinkTo(link) {
      axios.get(link).then((res) => {
        const parsedHTML = parse(res.data);
        const title = parsedHTML.querySelector('[name="t"]').attributes.value;
        this.$router.push({ name: 'song', query: { c: 'view', t: title, key: 0, symbol: '' } });
      });
    },
  },

  metaInfo: {
    title: 'ChordWiki',
  },
};
</script>

<style lang="sass">
.hero-logo
  width: 300px
  height: auto
.search_box_wrap
  min-width: 450px
  width: 40%
  margin: 40px auto
.search-input
  width: 100%

#chordwiki-plus-home
  .navbar-dropdown
    .navbar-item
      color: #363636

  .navbar-burger burger
    color: #fff

  .rank-text
    width: 40px

  .song-list-item
    cursor: pointer
    &:hover
      background: #fafafa

  .tags-buttons
    display: inline-block
</style>
