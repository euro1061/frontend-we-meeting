import dayjs from 'dayjs';
import { ref } from 'vue'

interface Event {
  id: number;
  title: string;
  date: Date;
  color: string;
  attendeeCount?: number;
  bookingBy?: string;
  bookingDate?: string;
  roomName?: string;
  startTime?: string;
  endTime?: string;
  titleDisplay?: string;
}

interface EventState {
  events: Event[];
}

export const useEventState = () => useState<EventState>('event', () => ({
  events: []
}))

export function useEventManagement() {
  const { $api } = useNuxtApp()
  const state = useEventState()

  const events: Ref<Event[]> = ref([])

  const getEventsForDate = (year: number, month: number, date: number): Event[] => {
    const eventDate = dayjs(`${year}-${month + 1}-${date}`)
    return state.value.events.filter(event =>
      dayjs(event.date).isSame(eventDate, 'day')
    )
  }

  const showEventDetails = (event: Event): void => {
    console.log('Event details:', event)
  }

  const fetchEvents = async (year: string, month: string): Promise<void> => {
    try {
      const yearCurrent = year || dayjs().year()
      const monthCurrent = month || dayjs().month() + 1

      const resReport = await $api.api.getApiReportsMonthlyBookings({
        year: String(yearCurrent),
        month: String(monthCurrent)
      }, {secure: true})
      if(resReport.ok) {
        const data = await resReport.json()
        console.log(data)
        const mappedEvents = data.map((event: any) => ({
          id: event.id,
          title: `ห้อง ${event.titleDisplay}`,
          date: dayjs(event.bookingDate),
          color: '#fafcff',
          attendeeCount: event.attendeeCount,
          bookingBy: event.bookingBy,
          bookingDate: event.bookingDate,
          roomName: event.roomName,
          startTime: event.startTime,
          endTime: event.endTime,
          titleDisplay: event.titleDisplay
        }))
        state.value.events = mappedEvents
      }
    } catch (error) {
      console.log('Error fetching events:', error)
    }
  }

  return {
    events,
    getEventsForDate,
    showEventDetails,
    fetchEvents
  }
}