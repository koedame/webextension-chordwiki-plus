<template lang="pug">
#syncroom-plus-app
  router-view

  b-button#form-button(type="is-warning", icon-left="exclamation-triangle", @click="openContactFrom")
    strong 要望・不具合報告はこちら

  Footer
</template>

<script>
import Footer from './components/Footer';
import ContactForm from './components/ContactForm';

export default {
  components: {
    Footer,
  },
  methods: {
    openContactFrom() {
      this.$buefy.modal.open({
        parent: this,
        component: ContactForm,
      });
    },
  },
};
</script>

<style lang="sass">
@import "~bulma/sass/utilities/_all"
$navbar-breakpoint: $tablet
@import "~bulma"
@import "~buefy/src/scss/buefy"

.♣
  color: darkgreen
.♠
  color: mediumblue
.♥
  color: deeppink
.♦
  color: darkorange

.current-url
  max-width: 410px
  width: 100%


.bold
  font-weight: bold

.chord-and-lyrics
  display: inline-block
  margin-right: 10px
  margin-bottom: 5px
  vertical-align: bottom
  .chord-diagram
    filter: invert(22%) sepia(100%) saturate(1164%) hue-rotate(181deg) brightness(100%) contrast(100%)

    img
      display: inline-block
      transform: rotate(-90deg)
  .chord
    display: block
    color: #3273dc
    font-size: 14px
    line-height: 20px
    height: 20px
  .lyrics
    margin-left: 5px
    display: block
    line-height: 20px
    height: 20px

.empty-line
  height: 2em

.key
  background: #feecf0
  border-radius: 2px
  color: #cc0f35
  padding: 0 8px
  display: inline-block
  font-size: 14px
  margin: 10px 0

.comment
  background: #e6e6e6
  border-radius: 2px
  padding: 0 8px
  display: inline-block
  font-size: 14px
  margin: 10px 0

.comment-italic
  background: #e6e6e6
  border-radius: 2px
  padding: 0 8px
  display: inline-block
  font-size: 14px
  margin: 10px 0
  font-style: italic

.navbar-item.is-active
  .navbar-link
    color: #363636 !important

.icon
  vertical-align: bottom

.chordwiki-plus-song-page-tags
  margin-bottom: 1em

#form-button
  position: fixed
  bottom: 20px
  right: 12px
</style>
