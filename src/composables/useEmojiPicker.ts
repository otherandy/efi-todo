import { reactive } from 'vue';
import type { ListItem } from '@/models/list-item.model';
import type { EmojiData } from 'emoji-mart-vue-fast-next/src';

const state = reactive({
    visible: false,
    x: 0,
    y: 0,
    activeItem: null as ListItem | null,
});

function open(event: MouseEvent, item: ListItem) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    state.x = rect.left;
    state.y = rect.bottom + 4;
    state.activeItem = item;
    state.visible = true;
}

function close() {
    state.visible = false;
    state.activeItem = null;
}

function select(emoji: EmojiData) {
    if (state.activeItem) {
        state.activeItem.emoji = emoji.id;
    }
    close();
}

export function useEmojiPicker() {
    return { state, open, close, select };
}
