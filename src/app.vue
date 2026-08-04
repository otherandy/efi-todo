<style lang="scss" scoped src="./app.scss"></style>

<template>
  <div class="bottom-bar">
    <div class="left">

    </div>
    <div class="right">
      <DateWidget></DateWidget>
      <PictureWidget></PictureWidget>
    </div>
  </div>
</template>

<script setup lang="ts">
import DateWidget from './components/date-widget/date-widget.vue';
import PictureWidget from './components/picture-widget/picture-widget.vue';

</script>