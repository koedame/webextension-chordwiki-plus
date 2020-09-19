<template lang="pug">
span#chordwiki-plus-metronome
  span(v-show="metronomeTick")
    img.clock-hands(:src="metronomeHandsLeftPath")
    img.clock-hands.hide(:src="metronomeHandsRightPath")
  span(v-show="!metronomeTick")
    img.clock-hands.hide(:src="metronomeHandsLeftPath")
    img.clock-hands(:src="metronomeHandsRightPath")
</template>

<script>
const browser = require('webextension-polyfill');

export default {
  props: {
    bpm: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      meteonomeTimer: null,
      count: 0,
      metronomeHandsLeftPath: browser.extension.getURL('/images/metronome-hands-left.png'),
      metronomeHandsRightPath: browser.extension.getURL('/images/metronome-hands-right.png'),
    };
  },
  mounted() {
    const metronomeInterval = 60000 / this.bpm;
    this.meteonomeTimer = setInterval(this.countUp, metronomeInterval);
  },

  computed: {
    metronomeTick() {
      return this.count % 2;
    },
  },

  methods: {
    countUp() {
      this.count++;
    },
  },

  destroyed() {
    if (this.meteonomeTimer) {
      clearInterval(this.meteonomeTimer);
    }
  },
};
</script>

<style lang="sass" scoped>
#chordwiki-plus-metronome
  margin-right: 5px

.clock-hands
  display: inline-block
  width: 6px
  height: 12px
  vertical-align: text-bottom

.hide
  opacity: 0
</style>
