<template lang="pug">
#chordwiki-plus-ranking-page
  Header

  .container
    .section
      gcse:search
</template>

<script>
import Header from '../components/Header';

export default {
  components: {
    Header,
  },

  data() {
    return {};
  },

  mounted() {
    if (this.$store.getters['search/keyword'] === '') {
      this.$store.dispatch('search/setKeyword', decodeURIComponent(location.hash.replace(/#gsc\.q=/, '')));
    }

    const gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = 'https://www.google.com/cse/cse.js?cx=partner-pub-6362118305215071:5650785010';
    document.head.appendChild(gcse);
  },

  methods: {
    search(value) {
      document.getElementById('gsc-i-id1').value = value;
      document.querySelector('.gsc-search-button.gsc-search-button-v2').click();
    },
  },
  computed: {
    keyword() {
      return this.$store.getters['search/keyword'];
    },
  },
  watch: {
    keyword(value, old) {
      this.search(value);
    },
  },

  metaInfo() {
    return {
      title: `「${this.keyword}」の検索結果 | ChordWiki`,
    };
  },
};
</script>

<style lang="sass">
#adBlock
  display: none !important

.gsc-adBlock
  display: none !important

form.gsc-search-box.gsc-search-box-tools
  height: 0 !important
  overflow: hidden !important
</style>
