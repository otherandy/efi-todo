<style lang="scss" scoped src="./picture-widget.scss"></style>

<template>
    <div class="picture-widget">
        <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="image-upload-input"
            @change="onFileChange"/>

        <img
            v-if="previewUrl"
            :src="previewUrl"
            alt="Selected image preview"
            class="image-upload-preview"
            @click="openFilePicker"/>
        <button
            v-else
            type="button"
            class="icon-upload-trigger"
            :class="{ 'icon-upload-trigger-filled': previewUrl }"
            @click="openFilePicker">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16V4M12 4L7 9M12 4l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);

function openFilePicker() {
  fileInput.value?.click();
}

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            previewUrl.value = base64String;
            localStorage.setItem('image', base64String);
        };
        reader.readAsDataURL(file);
    }
}

onMounted(() => {
    previewUrl.value = localStorage.getItem('image');
});
</script>