<style lang="scss" scoped src="./list.scss"></style>

<template>
    <div class="list-container">
        <div class="list-header" :style="{ '--tag-color': list.color }">
            <div
                class="tag"
                :class="{ 'tag-folded': list.hidden }"
                @click="atList$.toggleHidden(list.id)"
            ></div>
            <div class="icon"></div>
            <div class="list-header-title">
                {{ list.title }}
            </div>
            <button class="checkbox-btn" :style="{ '--checkbox-color': list.color }">
                <component :is="CheckboxUnchecked" />
            </button>
        </div>
        <div class="list-items" v-show="!list.hidden">
            <ListItem v-for="item in list.items" :key="item.id" :item="item"></ListItem>
        </div>
        <ContextMenu
            v-if="showMenu"
            @action-clicked="onActionClicked"
            :actions="menuActions"
            :x="menuState.x"
            :y="menuState.y"
            v-on-click-outside="closeMenu">
        </ContextMenu>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ListItem from '../list-item/list-item.vue';
import type { List } from '@/models/list.model';
import { useAtListStore } from '@/store';
import CheckboxUnchecked from '@assets/icons/checkbox-unchecked.svg';
import CheckboxChecked from '@assets/icons/checkbox-checked.svg';
import type { MenuState } from '@/models/menu-state.model.ts';
import type { MenuAction } from '@/models/menu-action.model.ts';

const { list } = defineProps<{
    list: List;
}>();

const atList$ = useAtListStore();

const showMenu = ref(false);
const menuState = ref<MenuState>({
    x: 0,
    y: 0
});


const menuActions = ref<MenuAction[]>([

]);

function onMenuClicked(event: MouseEvent) {
    event.preventDefault();
    showMenu.value = true;
    menuState.value.x = event.clientX;
    menuState.value.y = event.clientY;
}

function closeMenu() {
    showMenu.value = false;
}

function onActionClicked(action: string) {

}
</script>
