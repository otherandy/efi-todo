<style lang="scss" scoped src="./app.scss"></style>

<template>
  <Header></Header>
  <div class="lists-container">
    <List
      v-for="list in lists"
      :key="list.id"
      :list="list">
    </List>
  </div>
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
import List from './components/list/list.vue';
import Header from './components/header/header.vue';
import { storeToRefs } from 'pinia';
import { useAtListStore } from './store/index.ts';

const atList$ = useAtListStore(); 
const { lists } = storeToRefs(atList$);
</script>