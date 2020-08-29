<template lang="pug">
a.chordwiki-plus-transpose-button(:href="href")
  | {{ originalText }}
</template>

<script>
export default {
  props: {
    originalText: {
      type: String,
      require: true,
    },
    href: {
      type: String,
      require: true,
    },
  },
};
</script>

<style lang="sass"></style>
