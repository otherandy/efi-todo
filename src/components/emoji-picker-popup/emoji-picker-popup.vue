<style lang="scss" scoped src="./emoji-picker-popup.scss"></style>

<template>
    <Teleport to="body">
        <div
            v-if="state.visible"
            class="global-emoji-popup"
            :style="{ top: state.y + 'px', left: state.x + 'px' }"
            v-on-click-outside="close">
            <Picker
                :data="emojiIndex"
                :set="EMOJI_SET"
                :showPreview="false"
                color="#87b2d3"
                @select="select" />
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { Picker } from 'emoji-mart-vue-fast-next/src';
import { useEmojiPicker } from '@/composables/useEmojiPicker';
import { emojiIndex, EMOJI_SET } from '@/composables/emoji-data';
import { vOnClickOutside } from '@vueuse/components';

const { state, close, select } = useEmojiPicker();
</script>
