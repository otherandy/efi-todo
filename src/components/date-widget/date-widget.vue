<style lang="scss" scoped src="./date-widget.scss"></style>

<template>
    <div class="date-widget">
        <div class="date-header">
            <span> {{ date.getFullYear() }} </span>
            <div class="separator vertical-separator"></div>
            <span> {{ `W${String(getWeek()).padStart(2, "0")}` }} </span>
        </div>
        <div class="separator horizontal-separator"></div>
        <div class="date-body">
            <span> {{ MONTHS[date.getMonth()] }} </span>
            <div class="separator vertical-separator"></div>
            <span> {{ date.getDate() }} </span>
            <div class="separator vertical-separator"></div>
            <span class="day-emoji"> {{ DAYS[date.getDay()] }} </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const DAYS = ["☀️", "🌙", "🔥", "💧", "🌳", "⭐", "🏔"];


const date = ref(new Date());
let interval: ReturnType<typeof setInterval> | undefined;

const getWeek = function () {
    const target = new Date(date.value.valueOf());
    const dayNr = (date.value.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() != 4) {
        target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
};

onMounted(() => {
  interval = setInterval(() => {
    date.value = new Date()
  }, 1000);
})

onUnmounted(() => {
  clearInterval(interval);
});
</script>