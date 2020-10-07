<template lang="pug">
.chordwiki-plus-custom-footer
  footer.footer
    .container
      .menu
        .menu-label メニュー
        .menu-list
          router-link(:to="{name: 'home'}") ホーム
          a(href="https://ja.chordwiki.org/TermOfUse.html") 利用規約
          a(href="https://ja.chordwiki.org/Guideline.html") 編集ガイドライン
          a(href="https://ja.chordwiki.org/help.html") ヘルプ
          a(href="https://ja.chordwiki.org/setlists.cgi") 新着セットリスト
          a(href="https://ja.chordwiki.org/wiki.cgi?c=deleted") 削除済み
          a(href="https://ja.chordwiki.org/cd.html") コードブック
          a(href="https://ja.chordwiki.org/random.cgi") ランダム表示
          a(href="https://ja.chordwiki.org/wiki.cgi?c=editlist") マイセットリスト
          a(href="https://ja.chordwiki.org/tagcloud.html") タグ一覧
          a(href="https://ja.chordwiki.org/list/1.html") 楽曲一覧
          a(href="https://ja.chordwiki.org/new.html") 新規作成
          a(href="http://chordwiki.blog75.fc2.com/") ブログ
          a(href="http://jbbs.shitaraba.net/music/25009/") 掲示板
          a(href="https://ja.chordwiki.org/search2.html#gsc.tab=0") 横断検索

    hr

    .container
      p
        img.licence_image(src="https://ja.chordwiki.org/jasrac.png", alt="JASRAC許諾マーク")
        span.licence_text JASRAC許諾番号:9010346004Y38026

    hr

    .content.has-text-centered
      p
        | Copyright (C) 2006-{{currentYear}} ChordWiki and
        |
        a(href="http://worris3.tumblr.com/works")
          | worris
        | . Some Rights Reserved.
</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
    };
  },
};
</script>

<style lang="sass" scoped>
.licence_image
  width: 35px
  height: 35px

.licence_text
  font-size: 12px
  padding-left: 1em
</style>
