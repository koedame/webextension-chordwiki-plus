<template lang="pug">
#chordwiki-plus-ranking-page
  Header

  .container
    .section
      h1.title.is-5
        b-icon(icon="chart-line", type="is-success")
        |
        | ランキング 1-99位
      .box(v-if="rankings.length === 0")
        .media(v-for="i in 30")
          figure.media-left
            p.image.is-32x32
              b-skeleton(size="is-large", height="32px")
          .media-content
            .content
              b-skeleton
      .box(v-else)
        .media.song-list-item(v-for="song in rankings", @click="songLinkTo(song.link)", :key="song.title")
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

</template>

<script>
import Header from '../components/Header';

import axios from 'axios';
import { parse } from 'node-html-parser';

export default {
  components: {
    Header,
  },

  data() {
    return {
      rankings: [],
    };
  },
  mounted() {
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
  },

  methods: {
    songLinkTo(link) {
      axios.get(link).then((res) => {
        const parsedHTML = parse(res.data);
        const title = parsedHTML.querySelector('[name="t"]').attributes.value;
        this.$router.push({ name: 'song', query: { c: 'view', t: title, key: 0, symbol: '' } });
      });
    },
  },

  metaInfo() {
    return {
      title: 'ランキング 1-99位 | ChordWiki',
    };
  },
};
</script>

<style lang="sass">
#chordwiki-plus-ranking-page
  .song-list-item
    cursor: pointer
    &:hover
      background: #fafafa
</style>
