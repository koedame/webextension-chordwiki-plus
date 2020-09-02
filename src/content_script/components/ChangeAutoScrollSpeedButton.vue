<template lang="pug">
.chordwiki-plus-change-auto-scroll-speed-button
  .vertical-buttons
    //- TODO 直線的な変化ではなくてカーブをつくる
    b-button.vertical-buttons__item(v-if="$store.state.config.autoScrollSpeed === 400", type="is-info", size="is-small", @click="changeSpeed(400)") 1
    b-button.vertical-buttons__item(v-else, size="is-small", @click="changeSpeed(400)") 1

    b-button.vertical-buttons__item(v-if="$store.state.config.autoScrollSpeed === 300", type="is-info", size="is-small", @click="changeSpeed(300)") 2
    b-button.vertical-buttons__item(v-else, size="is-small", @click="changeSpeed(300)") 2

    b-button.vertical-buttons__item(v-if="$store.state.config.autoScrollSpeed === 200", type="is-info", size="is-small", @click="changeSpeed(200)") 3
    b-button.vertical-buttons__item(v-else, size="is-small", @click="changeSpeed(200)") 3

    b-button.vertical-buttons__item(v-if="$store.state.config.autoScrollSpeed === 150", type="is-info", size="is-small", @click="changeSpeed(150)") 3.5
    b-button.vertical-buttons__item(v-else, size="is-small", @click="changeSpeed(150)") 3.5

    b-button.vertical-buttons__item(v-if="$store.state.config.autoScrollSpeed === 100", type="is-info", size="is-small", @click="changeSpeed(100)") 4
    b-button.vertical-buttons__item(v-else, size="is-small", @click="changeSpeed(100)") 4

    b-button.vertical-buttons__item(v-if="$store.state.config.autoScrollSpeed === 50", type="is-info", size="is-small", @click="changeSpeed(50)")  5
    b-button.vertical-buttons__item(v-else, size="is-small", @click="changeSpeed(50)")  5
</template>

<script>
export default {
  methods: {
    changeSpeed(value) {
      this.$store.dispatch('config/setAutoScrollSpeed', value);
    },
  },
};
</script>

<style lang="sass" scoped>
.chordwiki-plus-change-auto-scroll-speed-button
  position: fixed
  left: 0
  top: 340px

.vertical-buttons
  &__item
    display: block !important
    width: 20px

.chordwiki-plus-change-auto-scroll-speed-button
  @import "~bulma/sass/utilities/_all"
  @import "~bulma"
  @import "~buefy/src/scss/buefy"
</style>
