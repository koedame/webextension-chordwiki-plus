<template lang="pug">
#scroll-afterimage(:style="{top: `${topPosition}px`}")
</template>

<script>
export default {
  data() {
    return {
      topPosition: 0,
      changeTopPositionTimer: null,
      lastPageYOffset: null,
    };
  },
  mounted() {
    this.topPosition = document.documentElement.clientHeight + window.pageYOffset - 10;
    this.lastPageYOffset = window.pageYOffset;
    window.addEventListener('scroll', this.changeTopPosition);
  },
  methods: {
    changeTopPosition() {
      if (this.changeTopPositionTimer) {
        clearTimeout(this.changeTopPositionTimer);
      }
      if (this.lastPageYOffset > window.pageYOffset) {
        // 上スクロールはすぐに動かす
        this.topPosition = document.documentElement.clientHeight + window.pageYOffset - 10;
      } else if (this.topPosition < window.pageYOffset) {
        // はみ出したらすぐ動かす
        this.topPosition = document.documentElement.clientHeight + window.pageYOffset - 10;
      } else {
        // 下スクロールは時間差で動かす
        this.changeTopPositionTimer = setTimeout(() => {
          this.topPosition = document.documentElement.clientHeight + window.pageYOffset - 10;
        }, 1000);
      }

      this.lastPageYOffset = window.pageYOffset;
    },
  },
  destroyed: function () {
    window.removeEventListener('scroll', this.changeTopPosition, false);
    clearTimeout(this.changeTopPositionTimer);
  },
};
</script>

<style lang="sass">
#scroll-afterimage
  position: absolute
  left: 0
  background: #4f776624
  width: 100%
  height: 10px
</style>
