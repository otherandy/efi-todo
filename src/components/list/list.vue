<style lang="scss" scoped src="./list.scss"></style>

<template>
    <div class="list-container">
        <div class="list-items">
            <ListItem
                v-for="item in list.items"
                :key="item.id"
                :item="item">
            </ListItem>
        </div>
    </div>
</template>

<script setup lang="ts">
import ListItem from '../list-item/list-item.vue';
import type { List } from '@/models/list.model';

const { list } = defineProps<{
    list: List;
}>();
</script>