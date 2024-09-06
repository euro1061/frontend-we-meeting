<template>
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-light">{{ currentMonth }} {{ currentYear }}</h2>
        <div class="flex items-center space-x-2">
            <UButton @click="$emit('previous-month')" color="gray" variant="outline"
                class="flex items-center px-3 py-1">
                <UIcon name="i-heroicons-chevron-left-20-solid" class="w-5 h-5 mr-1" />
                เดือนก่อนหน้า
            </UButton>
            <UButton @click="$emit('go-to-today')" color="gray" variant="outline" class="flex items-center px-3 py-1">
                <UIcon name="i-heroicons-calendar-20-solid" class="w-5 h-5 mr-1" />
                วันนี้
            </UButton>
            <UButton @click="$emit('next-month')" color="gray" variant="outline" class="flex items-center px-3 py-1">
                <UIcon name="i-heroicons-chevron-right-20-solid" class="w-5 h-5 mr-1" />
                เดือนถัดไป
            </UButton>
        </div>
    </div>
</template>

<script setup>
defineProps({
    currentMonth: String,
    currentYear: Number
})

defineEmits(['previous-month', 'next-month', 'go-to-today'])
</script>