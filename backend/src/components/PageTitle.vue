<template>
    <h1 class="text-3xl font-bold text-center text-primary my-3">{{ title }}</h1>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        default: ''
    }
});
</script>