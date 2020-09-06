<template lang="pug">
#chordwiki-plus-embed-player(v-show="$store.state.config.embedYouTube")
  iframe.chordwiki-plus-embed-playere__iframe(
    width="500",
    height="150",
    :src="`https://www.youtube.com/embed/${movie}`",
    frameborder="0",
    allow="encrypted-media;",
    allowfullscreen
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

<style lang="sass" scoped>
.chordwiki-plus-embed-playere__iframe
  width: 90%
</style>
