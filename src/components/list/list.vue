<style lang="scss" scoped src="./list.scss"></style>

<template>
    <div class="list-container">
        <div
            class="list-header"
            :class="[list.hidden ? 'tag-folded': 'tag']"
            :style="{ '--tag-color': list.color }">
            <div class="icon"></div>
            <div class="list-header-title">
                {{ list.title }}
            </div>
            <button
                class="checkbox-btn"
                :style="{ '--checkbox-color': list.color }">
                <component :is="CheckboxUnchecked" />
            </button>
        </div>
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
import CheckboxUnchecked from '@assets/icons/checkbox-unchecked.svg';
import CheckboxChecked from '@assets/icons/checkbox-checked.svg';

const { list } = defineProps<{
    list: List;
}>();
</script>