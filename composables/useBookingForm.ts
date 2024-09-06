// composables/useBookingForm.ts
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import { useTimeOptions } from './useTimeOptions'
import { useBookingActions } from './useBookingState'

export function useBookingForm() {
    const { searchAvailableRooms: searchRooms } = useBookingActions()
    const { timeOptions } = useTimeOptions()

    const formState = ref({
        bookingDate: '',
        startTime: null || '',
        endTime: null || ''
    })

    const isLoading = ref(false)
    const availableRooms = ref([])
    const searched = ref(false)

    const today = computed(() => dayjs().format('YYYY-MM-DD'))

    const dateError = ref('')
    const startTimeError = ref('')
    const endTimeError = ref('')

    const isDateTouched = ref(false)
    const isStartTimeTouched = ref(false)
    const isEndTimeTouched = ref(false)

    const isFormValid = computed(() => {
        return formState.value.bookingDate && formState.value.startTime &&
            formState.value.endTime && !dateError.value &&
            !startTimeError.value && !endTimeError.value
    })

    watch(() => formState.value.bookingDate, (newDate) => {
        isDateTouched.value = true
        if (dayjs(newDate).isBefore(dayjs(), 'day')) {
            dateError.value = 'ไม่สามารถเลือกวันที่ย้อนหลังได้'
        } else {
            dateError.value = ''
        }
    })

    watch([() => formState.value.startTime, () => formState.value.endTime], ([newStartTime, newEndTime]) => {
        if (newStartTime) isStartTimeTouched.value = true
        if (newEndTime) isEndTimeTouched.value = true

        if (isStartTimeTouched.value && isEndTimeTouched.value) {
            if (newStartTime && newEndTime && newStartTime >= newEndTime) {
                startTimeError.value = 'เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด'
                endTimeError.value = 'เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น'
            } else {
                startTimeError.value = ''
                endTimeError.value = ''
            }
        }
    }, { immediate: false })

    async function searchAvailableRooms() {
        if (!isFormValid.value) return

        isLoading.value = true
        const startBooking = dayjs(`${formState.value.bookingDate}T${formState.value.startTime}`).add(7, 'hours')
        const endBooking = dayjs(`${formState.value.bookingDate}T${formState.value.endTime}`).add(7, 'hours')

        await searchRooms(startBooking.toISOString(), endBooking.toISOString(), formState.value.startTime, formState.value.endTime)
        isLoading.value = false
    }

    function onResetField() {
        formState.value.bookingDate = ''
        formState.value.startTime = null || ''
        formState.value.endTime = null || ''
        searched.value = false
        dateError.value = ''
        startTimeError.value = ''
        endTimeError.value = ''
        isDateTouched.value = false
        isStartTimeTouched.value = false
        isEndTimeTouched.value = false
    }

    return {
        formState,
        isLoading,
        availableRooms,
        isDateTouched,
        isStartTimeTouched,
        isEndTimeTouched,
        searched,
        today,
        dateError,
        startTimeError,
        endTimeError,
        isFormValid,
        timeOptions,
        onResetField,
        searchAvailableRooms
    }
}