<style lang="scss" scoped src="./header.scss"></style>

<template>
    <header class="header">
        <button
            class="menu-btn">
            <MenuIcon></MenuIcon>
            
        </button>
    </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MenuIcon from '@assets/icons/menu.svg';
import type { MenuState } from '@/models/menu-state.model.ts';


</script>
