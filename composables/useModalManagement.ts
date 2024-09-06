import { ref, computed } from 'vue'
import { useEventState } from './useEventManagement'
import dayjs from 'dayjs';

interface Booking {
  id: number;
  room: string;
  title: string;
  attendees: number;
  bookedBy: string;
  startTime: string;
  endTime: string;
  status: string;
}

export function useModalManagement() {
  const isModalOpen: Ref<boolean> = ref(false)
  const selectedModalDate: Ref<Date | undefined> = ref(undefined)
  const stateEvent = useEventState()

  const openModal = (date: Date): void => {
    selectedModalDate.value = date
    isModalOpen.value = true
  }

  const closeModal = (): void => {
    isModalOpen.value = false
  }

  const bookingsForSelectedDate: ComputedRef<Booking[]> = computed(() => {
    if (!selectedModalDate.value) return []
    // This is a placeholder. Replace with actual booking data fetching logic
    const events = stateEvent.value.events

    const selectedDate = dayjs(selectedModalDate.value)
    const eventsForSelectedDate = events.filter(event => {
      console.log(event.bookingDate)
      return dayjs(event.bookingDate).isSame(selectedDate, 'day')
    })
    .map(event => {
      return {
        id: event.id,
        room: event.roomName || '',
        title: event.title,
        attendees: event.attendeeCount || 0,
        bookedBy: event.bookingBy || '',
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        status: 'confirmed'
      }
    })
    return eventsForSelectedDate
  })




  return {
    isModalOpen,
    selectedModalDate,
    openModal,
    closeModal,
    bookingsForSelectedDate
  }
}