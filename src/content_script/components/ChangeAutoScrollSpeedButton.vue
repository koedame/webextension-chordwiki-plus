<template lang="pug">
.chordwiki-plus-change-auto-scroll-speed-button
  .vertical-buttons
    b-button.vertical-buttons__item(v-if="$store.state.autoScroll.scrollSpeed === 300", type="is-info", size="is-small", @click="changeSpeed(300)") 1
    b-button.vertical-buttons__item(v-else, size="is-small", @click="changeSpeed(300)") 1

    b-button.vertical-buttons__item(v-if="$store.state.autoScroll.scrollSpeed === 200", type="is-info", size="is-small", @click="changeSpeed(200)") 2
    b-button.vertical-buttons__item(v-else, size="is-small", @click="changeSpeed(200)") 2

    b-button.vertical-buttons__item(v-if="$store.state.autoScroll.scrollSpeed === 150", type="is-info", size="is-small", @click="changeSpeed(150)") 3
    b-button.vertical-buttons__item(v-else, size="is-small", @click="changeSpeed(150)") 3

    b-button.vertical-buttons__item(v-if="$store.state.autoScroll.scrollSpeed === 100", type="is-info", size="is-small", @click="changeSpeed(100)") 4
    b-button.vertical-buttons__item(v-else, size="is-small", @click="changeSpeed(100)") 4

    b-button.vertical-buttons__item(v-if="$store.state.autoScroll.scrollSpeed === 50", type="is-info", size="is-small", @click="changeSpeed(50)")  5
    b-button.vertical-buttons__item(v-else, size="is-small", @click="changeSpeed(50)")  5

    b-button.vertical-buttons__item(v-if="!$store.state.autoScroll.timer", type="is-warning", size="is-small", @click="run") 開始
    b-button.vertical-buttons__item(v-if="$store.state.autoScroll.timer", type="is-danger", size="is-small", @click="stop") 停止
</template>

<script>
export default {
  methods: {
    changeSpeed(value) {
      this.$store.dispatch('autoScroll/setScrollSpeed', value).then(() => {
        this.$store.dispatch('autoScroll/stopAutoScroll').then(() => {
          this.$store.dispatch('autoScroll/runAutoScroll');
        });
      });
    },
    stop() {
      this.$store.dispatch('autoScroll/stopAutoScroll');
    },
    run() {
      this.$store.dispatch('autoScroll/runAutoScroll');
    },
  },
};
</script>

<style lang="sass" scoped>
@media only screen and (max-width: 1024px)
  .chordwiki-plus-change-auto-scroll-speed-button
    position: fixed
    bottom: 0

  .vertical-buttons
    &__item
      height: 30px !important

@media only screen and (min-width: 1024px)
  .chordwiki-plus-change-auto-scroll-speed-button
    position: fixed
    left: 0
    top: 340px

  .vertical-buttons
    &__item
      display: block !important
      width: 40px
      // text-align: center
      padding: 0
</style>
