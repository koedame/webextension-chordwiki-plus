<template lang="pug">
#chordwiki-plus-you-tube-embed-player
  iframe.chordwiki-plus-you-tube-embed-player__iframe(
    width="500",
    height="150",
    :src="`https://www.youtube.com/embed/${youtubeId}`",
    frameborder="0",
    allow="encrypted-media;",
    allowfullscreen
  )
</template>

<script>
export default {
  props: {
    youtubeId: {
      type: String,
      require: true,
    },
  },
};
</script>

<style lang="sass" scoped>
.chordwiki-plus-you-tube-embed-player__iframe
  width: 100%
</style>
