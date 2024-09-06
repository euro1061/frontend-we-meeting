<!-- components/AvailableRooms.vue -->
<template>
  <div v-if="rooms.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <UCard v-for="room in rooms" :key="room.id" class="flex flex-col h-full">
      <img class="w-full h-40 object-cover object-center" :src="room.imageUrl" :alt="room.name">
      <div class="flex-grow p-4">
        <h3 class="text-lg font-semibold mb-2">{{ room.name }}</h3>
        <p class="text-gray-600">รองรับได้: {{ room.capacity }} คน</p>
      </div>
      <div class="p-4 pt-0">
        <UButton color="primary" @click="openBookingModal(room)" block>
          จองห้องนี้
        </UButton>
      </div>
    </UCard>
  </div>
  <UAlert v-else-if="searched" color="yellow" variant="soft" icon="i-heroicons-exclamation-triangle" class="mt-4">
    ไม่พบห้องว่างตามเงื่อนไขที่ระบุ
  </UAlert>

  <BookingModal v-if="selectedRoom" v-model:isOpen="isModalOpen" :room="selectedRoom" :default-date="defaultDate"
    :default-start-time="defaultStartTime" :default-end-time="defaultEndTime" @book="bookRoom" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BookingModal from '~/components/feature-specific/BookingModal.vue'

const props = defineProps<{
  rooms: Array<{
    id: number
    name: string
    description: string
    capacity: number
    imageUrl: string
  }>,
  searched: boolean
  defaultDate: string
  defaultStartTime: string | ''
  defaultEndTime: string | ''
}>()

const emit = defineEmits<{
  (e: 'book', bookingData: any): void
}>()

const isModalOpen = ref(false)
const selectedRoom = ref(null || {
  id: 0,
  name: '',
  description: '',
  capacity: 0,
  imageUrl: ''
})

const openBookingModal = (room: {
  id: number
  name: string
  description: string
  capacity: number
  imageUrl: string
}) => {
  selectedRoom.value = room
  isModalOpen.value = true
}

const bookRoom = (bookingData: any) => {
  emit('book', bookingData)
}
</script>