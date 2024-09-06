<template>
    <UModal :prevent-close="false" @outside-click="closeModal" v-model="props.isOpen" :ui="{
        width: 'w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl',
    }">
        <div class="p-4">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">
                    รายการจองของวันที่: {{ formatDate(selectedDate) }}
                </h2>
                <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="closeModal" />
            </div>
            <div v-if="activeTab === 'bookings'">
                <div v-if="Object.keys(groupedBookings).length === 0" class="text-center py-4 text-gray-500">
                    ยังไม่มีการจองในวันนี้
                </div>
                <div v-else v-for="(roomBookings, roomName) in groupedBookings" :key="roomName" class="mb-4">
                    <UAccordion :items="[{ label: `${roomName} (${roomBookings.length} รายการ)`, defaultOpen: true }]" :ui="{
                        wrapper: 'bg-gray-100 rounded-lg overflow-hidden',
                        item: {
                            base: 'border-b border-gray-200 last:border-none',
                            trigger: { base: 'bg-gray-100 hover:bg-gray-200' },
                            content: 'bg-white'
                        }
                    }">
                        <template #item="{ item, open }">
                            <UAccordionItem :item="item" :open="open">
                                <template #header>
                                    <div class="flex justify-between items-center w-full">
                                        <h3 class="text-lg font-medium text-blue-600">{{ item.label }}</h3>
                                        <UIcon name="i-heroicons-chevron-down-20-solid"
                                            class="w-5 h-5 transition-transform duration-200 text-blue-600"
                                            :class="{ 'rotate-180': open }" />
                                    </div>
                                </template>
                                <ul class="p-2">
                                    <li v-for="booking in roomBookings" :key="booking.id"
                                        class="flex justify-between items-center p-2 bg-white rounded mb-2">
                                        <div>
                                            <p class="font-medium text-blue-500">{{ booking.title }}</p>
                                            <p class="text-sm text-gray-600 font-light">จำนวนผู้เข้าร่วม: {{
                                                booking.attendees }}</p>
                                            <p class="text-sm text-gray-600 font-light">ผู้จอง: {{ booking.bookedBy }}
                                            </p>
                                        </div>
                                        <UBadge :color="getBookingStatusColor(booking.status)" size="lg">
                                            {{ formatTimeRange(booking.startTime, booking.endTime) }}
                                        </UBadge>
                                    </li>
                                </ul>
                            </UAccordionItem>
                        </template>
                    </UAccordion>
                </div>
            </div>
            <div v-else-if="activeTab === 'available'">
                <!-- Content for available rooms -->
                <p>แสดงรายการห้องประชุมที่ว่างอยู่</p>
            </div>
        </div>
    </UModal>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    selectedDate: Date,
    bookings: Array
})

const emit = defineEmits(['close'])

const activeTab = ref('bookings')

const closeModal = () => {
    emit('close')
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })
}

const formatTimeRange = (start, end) => {
    return `${start.slice(0, 5)} - ${end.slice(0, 5)}`
}

const getBookingStatusColor = (status) => {
    return status === 'confirmed' ? 'blue' : 'gray'
}

const groupedBookings = computed(() => {
    return props.bookings.reduce((acc, booking) => {
        if (!acc[booking.room]) {
            acc[booking.room] = []
        }
        acc[booking.room].push(booking)
        return acc
    }, {})
})
</script>