<template>
    <div>
        <h1>Test Page {{ id }}</h1>
    </div>
</template>

<script setup>
const { id } = useRoute().params
</script>