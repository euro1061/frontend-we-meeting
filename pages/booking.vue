<!-- pages/booking.vue -->
<template>
  <h1 class="text-2xl font-normal mb-6">จองห้องประชุม</h1>
  <BookingForm @search="onSearch" />
  <AvailableRooms :rooms="bookingState.availableRooms" :searched="bookingState.searched"
    :default-date="bookingState.defaultDateBooking" :default-start-time="bookingState.defaultStartTimeBooking"
    :default-end-time="bookingState.defaultEndTimeBooking" @book="handleBooking" />
</template>

<script setup lang="ts">
import { useBookingForm } from '~/composables/useBookingForm'
import { useBookingState } from '~/composables/useBookingState'
import BookingForm from '~/components/ui/BookingForm.vue'
import AvailableRooms from '~/components/ui/AvailableRooms.vue'
import dayjs from 'dayjs';

const { resetResult } = useBookingActions()
const { $api } = useNuxtApp()
const bookingState = useBookingState()
const { searchAvailableRooms, formState: bookingForm } = useBookingForm()
const toast = useToast()

function onSearch() {
  searchAvailableRooms()
}

async function handleBooking(bookingData: {
  roomId: number,
  attendeeCount: number,
  description: string,
  startTime: string,
  endTime: string,
  title: string,
  bookingDate: string
}) {
  // TODO: Implement booking logic here
  try {
    const startDateTime = dayjs(`${bookingData.bookingDate} ${bookingData.startTime}`).add(7, 'hour').toISOString()
    const endDateTime = dayjs(`${bookingData.bookingDate} ${bookingData.endTime}`).add(7, 'hour').toISOString()

    const resBooking = await $api.api.postApiBookingBookings({
      roomId: bookingData.roomId,
      attendeeCount: bookingData.attendeeCount,
      description: bookingData.description,
      startTime: startDateTime,
      endTime: endDateTime,
      title: bookingData.title,
    }, { secure: true })

    if (resBooking.ok) {
      toast.add({
        id: 'booking-success',
        title: 'จองห้องสำเร็จ',
        description: 'การจองห้องสำเร็จ',
        color: 'green'
      })
      resetResult()
    }
  } catch (error) {
    const errorMessage = await getErrorMessage(error)
    toast.add({
      id: 'booking-error',
      title: 'เกิดข้อผิดพลาด',
      description: errorMessage,
      color: 'red'
    })
  }
  // You might want to call an API to save the booking
  // and then update the available rooms list
}

const getErrorMessage = async (error: unknown): Promise<string> => {
  if (error instanceof Error) {
    return error.message
  } else if (error instanceof Response) {
    try {
      const errorData = await error.json()
      return errorData.error || `ข้อผิดพลาดจากเซิร์ฟเวอร์: ${error.status}`
    } catch {
      return `ข้อผิดพลาดจากเซิร์ฟเวอร์: ${error.status}`
    }
  }
  return "เกิดข้อผิดพลาดที่ไม่คาดคิด"
}
</script>