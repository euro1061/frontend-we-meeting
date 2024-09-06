<template>
    <div class="border p-2 h-[150px] cursor-pointer transition-colors relative" :class="[
        { 'bg-gray-100': !isInCurrentMonth },
        { 'hover:bg-gray-50': isInCurrentMonth && !isSelected },
        { 'bg-[#fafcff]': isSelected },
        { 'border-t-[3px] border-t-[#5454ff]': isToday }
    ]" :style="isToday ? { '--gradient-start': '#1414bf', '--gradient-end': '#5454ff' } : {}"
        @click="$emit('select-date')">
        <div v-if="isInCurrentMonth" :class="{ 'font-bold': isToday }">
            {{ date }}
        </div>
        <div class="overflow-y-auto h-[100px] mt-1">
            <div v-for="event in events" :key="event.id" class="text-xs p-1 mb-1 rounded cursor-pointer truncate"
                :style="{ backgroundColor: event.color }" @click.stop="$emit('show-event-details', event)">
                {{ event.title }}
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    date: Number,
    isInCurrentMonth: Boolean,
    isToday: Boolean,
    isSelected: Boolean,
    events: Array
})

defineEmits(['select-date', 'show-event-details'])
</script>

<style scoped>
.border-gradient-to-r {
    border-image: linear-gradient(to right, var(--gradient-start), var(--gradient-end)) 1;
}
</style>