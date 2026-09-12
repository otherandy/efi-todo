<style lang="scss" scoped src="./list-item.scss"></style>

<template>
    <div
        class="list-item-container tag-folded"
        :style="{ '--tag-color': item.color }">
        <div class="icon" @click="openPicker">
            <Emoji
                v-if="item.emoji"
                :emoji="item.emoji"
                :data="emojiIndex"
                :set="EMOJI_SET"
                :size="24" />
        </div>
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
import { Emoji } from 'emoji-mart-vue-fast-next/src';
import { useEmojiPicker } from '@/composables/useEmojiPicker';
import { emojiIndex, EMOJI_SET } from '@/composables/emoji-data';

const { item } = defineProps<{
    item: ListItem;
}>();

const { open } = useEmojiPicker();

function onChecked() {
    item.checked = !item.checked;
}

function openPicker(event: MouseEvent) {
    open(event, item);
}
</script>