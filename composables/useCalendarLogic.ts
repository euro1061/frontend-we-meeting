import { ref, computed } from 'vue'

export function useCalendarLogic() {
  const { fetchEvents } = useEventManagement()

  const currentDate: Ref<Date> = ref(new Date())
  const selectedDate: Ref<Date | null> = ref(null)
  const daysOfWeek: string[] = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

  const currentMonth = computed((): string => {
    return currentDate.value.toLocaleString('th-TH', { month: 'long' })
  })

  const currentYear = computed((): number => {
    return currentDate.value.getFullYear() + 543 // Convert to Buddhist year
  })

  const weeksInMonth = computed((): number => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    return Math.ceil((startingDay + daysInMonth) / 7)
  })

  const getDate = (week: number, day: number): number | any => {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    const firstDay = new Date(year, month, 1)
    const startingDay = firstDay.getDay()
    
    const dateNumber = (week - 1) * 7 + day - startingDay
    if (dateNumber > 0 && dateNumber <= new Date(year, month + 1, 0).getDate()) {
      return dateNumber
    }
    return null
  }

  const isDateInCurrentMonth = (week: number, day: number): boolean => {
    return getDate(week, day) !== null
  }

  const isToday = (week: number, day: number): boolean => {
    const date = getDate(week, day)
    if (date === null) return false
    
    const today = new Date()
    return date === today.getDate() &&
           currentDate.value.getMonth() === today.getMonth() &&
           currentDate.value.getFullYear() === today.getFullYear()
  }

  const isCurrentMonth = (): boolean => {
    const today = new Date()
    return currentDate.value.getMonth() === today.getMonth() &&
           currentDate.value.getFullYear() === today.getFullYear()
  }

  const isSelected = (week: number, day: number): boolean => {
    const date = getDate(week, day)
    if (date === null || selectedDate.value === null) return false
    
    return date === selectedDate.value.getDate() &&
           currentDate.value.getMonth() === selectedDate.value.getMonth() &&
           currentDate.value.getFullYear() === selectedDate.value.getFullYear()
  }

  const previousMonth = async (): Promise<void> => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
    selectedDate.value = null
    await fetchEvents(currentDate.value.getFullYear().toString(), (currentDate.value.getMonth() + 1).toString())
  }

  const nextMonth = async (): Promise<void> => {
    currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
    selectedDate.value = null
    await fetchEvents(currentDate.value.getFullYear().toString(), (currentDate.value.getMonth() + 1).toString())
  }

  const goToToday = async (): Promise<void> => {
    const today = new Date()
    currentDate.value = new Date(today.getFullYear(), today.getMonth(), 1)
    selectedDate.value = today
    await fetchEvents(currentDate.value.getFullYear().toString(), (currentDate.value.getMonth() + 1).toString())
  }

  return {
    currentDate,
    selectedDate,
    daysOfWeek,
    currentMonth,
    currentYear,
    weeksInMonth,
    getDate,
    isDateInCurrentMonth,
    isToday,
    isCurrentMonth,
    isSelected,
    previousMonth,
    nextMonth,
    goToToday
  }
}