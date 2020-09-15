<template lang="pug">
span#chordwiki-plus-metronome
  span(v-show="metronomeTick")
    span.clock-hands
      | \
    span.clock-hands.hide
      | /
  span(v-show="!metronomeTick")
    span.clock-hands.hide
      | \
    span.clock-hands
      | /
</template>

<script>
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
.clock-hands
  display: inline-block
  width: 10px
  color: #888

.hide
  color: #fff
</style>
