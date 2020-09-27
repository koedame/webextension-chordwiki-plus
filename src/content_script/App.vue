<template lang="pug">
#syncroom-plus-app
  router-view
  CustomFooter
</template>

<script>
import CustomFooter from './components/CustomFooter';

export default {
  components: {
    CustomFooter,
  },
};
</script>
