<template>
  <div class="bg-white shadow rounded-lg p-4">
    <CalendarHeader
      :current-month="currentMonth"
      :current-year="currentYear"
      @previous-month="previousMonth"
      @next-month="nextMonth"
      @go-to-today="goToToday"
    />

    <div class="grid grid-cols-7 gap-2">
      <div v-for="day in daysOfWeek" :key="day" class="text-center font-bold">
        {{ day }}
      </div>

      <CalendarDay
        v-for="(_, index) in weeksInMonth * 7"
        :key="index"
        :date="getDate(Math.floor(index / 7) + 1, (index % 7) + 1)"
        :is-in-current-month="isDateInCurrentMonth(Math.floor(index / 7) + 1, (index % 7) + 1)"
        :is-today="isToday(Math.floor(index / 7) + 1, (index % 7) + 1)"
        :is-selected="isSelected(Math.floor(index / 7) + 1, (index % 7) + 1)"
        :events="getEventsForDate(currentDate.getFullYear(), currentDate.getMonth(), getDate(Math.floor(index / 7) + 1, (index % 7) + 1))"
        @select-date="selectDate(Math.floor(index / 7) + 1, (index % 7) + 1)"
        @show-event-details="showEventDetails"
      />
    </div>

    <BookingDetailsModal
      :is-open="isModalOpen"
      :selected-date="selectedModalDate"
      :bookings="bookingsForSelectedDate"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCalendarLogic } from '@/composables/useCalendarLogic'
import { useEventManagement } from '@/composables/useEventManagement'
import { useModalManagement } from '@/composables/useModalManagement'
import CalendarHeader from '@/components/feature-specific/Calendar/CalendarHeader.vue'
import CalendarDay from '@/components/feature-specific/Calendar/CalendarDay.vue'
import BookingDetailsModal from '@/components/feature-specific/Calendar/BookingDetailsModal.vue'

const {
  currentDate,
  selectedDate,
  daysOfWeek,
  currentMonth,
  currentYear,
  weeksInMonth,
  getDate,
  isDateInCurrentMonth,
  isToday,
  isSelected,
  previousMonth,
  nextMonth,
  goToToday
} = useCalendarLogic()

const {
  getEventsForDate,
  showEventDetails,
  fetchEvents,
} = useEventManagement()

const {
  isModalOpen,
  selectedModalDate,
  openModal,
  closeModal,
  bookingsForSelectedDate
} = useModalManagement()

// เพิ่ม ref ใหม่เพื่อเก็บข้อมูลวันที่ถูกเลือก
const selectedDateInfo = ref({
  year: currentYear.value,
  month: currentMonth.value,
  date: null as number | null
})

const selectDate = (week: number, day: number) => {
  const date = getDate(week, day)
  if (date === null) return
  
  const selectedFullDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), date)
  selectedDate.value = selectedFullDate

  // อัปเดตข้อมูลวันที่ถูกเลือก
  selectedDateInfo.value = {
    year: selectedFullDate.getFullYear(),
    month: String(selectedFullDate.getMonth() + 1), // บวก 1 เพราะ getMonth() คืนค่า 0-11
    date: date
  }

  openModal(selectedFullDate)

  // คุณสามารถส่งข้อมูลนี้ไปยังคอมโพเนนต์แม่ได้ถ้าต้องการ
  // emit('date-selected', selectedDateInfo.value)
}

onMounted(async () => {
  await fetchEvents("", "")
})
</script>