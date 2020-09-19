<template lang="pug">
#chordwiki-plus-nico-video-embed-player
  script(
    type="application/javascript",
    :src="`https://embed.nicovideo.jp/watch/${movie}/script`"
  )
</template>

<script>
export default {
  props: {
    movie: {
      type: String,
      require: true,
    },
  },
};
</script>

<style lang="sass">
#chordwiki-plus-nico-video-embed-player
  iframe
    width: 100%
    height: 150px
</style>
