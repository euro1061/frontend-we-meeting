import { useState } from 'nuxt/app'

interface BookingState {
  availableRooms: Array<{
    id: number;
    name: string;
    description: string;
    capacity: number;
    imageUrl: string;
  }>;
  searched: boolean;
  defaultDateBooking: string;
  defaultStartTimeBooking: string | '';
  defaultEndTimeBooking: string | '';
}

export const useBookingState = () => useState<BookingState>('booking', () => ({
  availableRooms: [],
  searched: false,
  defaultDateBooking: '',
  defaultStartTimeBooking: '',
  defaultEndTimeBooking: ''
}))

export const useBookingActions = () => {
  const state = useBookingState()
  const { $api } = useNuxtApp()
  const toast = useToast()

  const searchAvailableRooms = async (startTime: string, endTime: string, startTimeCode: string | '', endTimeCode: string | '') => {
    try {
      const response = await $api.api.getApiBookingAvailableRooms({
        startTime,
        endTime
      }, { secure: true })

      if (response.ok) {
        const data = await response.json()
        state.value.availableRooms = data.map((item: any) => ({
          id: item.id,
          name: `ห้องประชุม ${item.name} (Available)`,
          capacity: item.capacity,
          imageUrl: `http://localhost:3000${item.imageUrl}`,
          description: item.description
        }))
        state.value.searched = true
        state.value.defaultDateBooking = startTime
        state.value.defaultStartTimeBooking = startTimeCode
        state.value.defaultEndTimeBooking = endTimeCode

        toast.add({
          id: 'search-available-rooms-success',
          title: 'Search Available Rooms',
          description: 'Search available rooms successfully',
          color: 'green'
        })
      }
    } catch (error) {
      toast.add({
        id: 'search-available-rooms-error',
        title: 'Search Available Rooms',
        description: 'Error searching for available rooms',
        color: 'red'
      })
      console.error('Error searching for available rooms:', error)
      state.value.availableRooms = []
      state.value.searched = true
    }
  }

  const resetResult = () => {
    state.value.availableRooms = []
    state.value.searched = false
  }

  return {
    searchAvailableRooms,
    resetResult
  }
}