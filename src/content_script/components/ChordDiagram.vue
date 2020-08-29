<template lang="pug">
span
  .chordwiki-plus-chord-diagram(v-if="$store.getters['config/chordDiagram']")
    img(:src="filePath")
  .chordwiki-plus-chord-name(v-else)
    | {{ chordName }}
</template>

<script>
export default {
  props: {
    chordName: {
      type: String,
      require: true,
    },
    filePath: {
      type: String,
      require: true,
    },
  },
};
</script>

<style lang="sass">
.chordwiki-plus-chord-diagram
  position: relative
  top: -1em
  font-size: smaller
  font-family: sans-serif

  display: inline-block
  overflow: hidden
  margin-top: 32px

  filter: invert(22%) sepia(100%) saturate(1164%) hue-rotate(181deg) brightness(100%) contrast(100%);

  img
    display: inline-block
    transform: rotate(-90deg)

.chordwiki-plus-chord-name
  position: relative
  top: -1.5em
  font-size: smaller
  font-family: sans-serif
  color: blue
  display: inline-block
  overflow: hidden
</style>
