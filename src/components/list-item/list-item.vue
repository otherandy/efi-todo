<style lang="scss" scoped src="./list-item.scss"></style>

<template>
    <div class="list-item-container">
        <div class="tag"></div>
        <div class="icon"></div>
        <div class="text">
            {{ item.text }}
        </div>
        <button
            class="checkbox-btn"
            @click="onChecked"
            :style="{ '--checkbox-color': item.color }">
            <component :is="item.checked ? CheckboxChecked : CheckboxUnchecked" />
        </button>
    </div>
</template>

<script setup lang="ts">
import type { ListItem } from '@/models/list-item.model';
import CheckboxUnchecked from '@assets/icons/checkbox-unchecked.svg';
import CheckboxChecked from '@assets/icons/checkbox-checked.svg';

const { item } = defineProps<{
    item: ListItem; 
}>();

function onChecked() {
    item.checked = !item.checked;
}
</script>