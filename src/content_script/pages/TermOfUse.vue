<template lang="pug">
div
  Header

  .container
    .section
      .content(v-html="originalHtml")
</template>

<script>
import axios from 'axios';

import { parse } from 'node-html-parser';

import Header from '../components/Header';

export default {
  components: { Header },
  data() {
    return {
      originalHtml: '',
    };
  },
  mounted() {
    axios.get('/TermOfUse.html').then((res) => {
      this.originalHtml = parse(res.data).querySelector('body').innerHTML;
    });
  },
  metaInfo() {
    return {
      title: '利用規約 | ChordWiki',
    };
  },
};
</script>
