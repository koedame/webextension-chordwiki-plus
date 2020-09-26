<template lang="pug">
.chordwiki-plus-custom-footer
  footer.footer
    .container
      .menu
        .menu-label メニュー
        .menu-list
          a(href="https://ja.chordwiki.org/") ホーム
          a(href="https://ja.chordwiki.org/TermOfUse.html") 利用規約
          a(href="https://ja.chordwiki.org/Guideline.html") 編集ガイドライン
          a(href="https://ja.chordwiki.org/help.html") ヘルプ
          a(href="https://ja.chordwiki.org/setlists.cgi") 新着セトリ
          a(href="https://ja.chordwiki.org/wiki.cgi?c=deleted") 削除済み
          a(href="http://seesaawiki.jp/w/chordwiki/") 楽曲リスト
          a(href="http://chordwiki.blog75.fc2.com/") ブログ
          a(href="https://ja.chordwiki.org/cd.html") コードブック
          a(href="https://ja.chordwiki.org/random.cgi") ランダム

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

<style lang="sass">
.chordwiki-plus-custom-footer
  @import "~bulma/sass/utilities/_all"
  @import "~bulma"
  @import "~buefy/src/scss/buefy"

  .licence_image
    width: 35px
    height: 35px

  .licence_text
    font-size: 12px
    padding-left: 1em
</style>
