<!-- pages/my-bookings.vue -->
<template>
    <h1 class="text-2xl font-normal mb-4">รายการจองของฉัน</h1>
    <UCard>
        <UCard>
            <UTable :columns="columns" :rows="bookings" :sort="{ column: 'startTime', direction: 'asc' }">
                <template #room-data="{ row }">
                    {{ row.room.name }}
                </template>
                <template #startTime-data="{ row }">
                    {{ formatDateTime(row.startTime) }}
                </template>
                <template #endTime-data="{ row }">
                    {{ formatDateTime(row.endTime) }}
                </template>
                <template #actions-data="{ row }">
                    <div class="flex space-x-2">
                        <UButton color="primary" variant="soft" icon="i-heroicons-pencil-square"
                            :disabled="isPastBooking(row.endTime)" @click="openEditModal(row)">
                            แก้ไข
                        </UButton>
                        <UButton color="red" variant="soft" icon="i-heroicons-trash"
                            :disabled="isPastBooking(row.endTime)" @click="cancelBooking(row.id)">
                            ยกเลิก
                        </UButton>
                    </div>
                </template>
            </UTable>
        </UCard>
    </UCard>

    <!-- Edit Booking Modal -->
    <UModal v-model="isEditModalOpen">
        <UCard>
            <template #header>
                <div class="text-xl font-medium">แก้ไขการจอง</div>
            </template>
            <form @submit.prevent="updateBooking">
                <UFormGroup label="หัวข้อการประชุม" name="title" :error="errors.title">
                    <UInput v-model="editingBooking.title" @blur="validateField('title')" />
                </UFormGroup>
                <UFormGroup label="รายละเอียดการประชุม" name="description" :error="errors.description">
                    <UTextarea v-model="editingBooking.description" @blur="validateField('description')" />
                </UFormGroup>
                <UFormGroup label="เวลาเริ่มต้น" name="startTime" :error="errors.startTime">
                    <UInput v-model="editingBooking.startTime" type="datetime-local"
                        @blur="validateField('startTime')" />
                </UFormGroup>
                <UFormGroup label="เวลาสิ้นสุด" name="endTime" :error="errors.endTime">
                    <UInput v-model="editingBooking.endTime" type="datetime-local" @blur="validateField('endTime')" />
                </UFormGroup>
                <UFormGroup label="จำนวนผู้เข้าร่วม" name="attendeeCount" :error="errors.attendeeCount">
                    <UInput v-model="editingBooking.attendeeCount" type="number" min="1"
                        @blur="validateField('attendeeCount')" />
                </UFormGroup>
                <div class="flex justify-end space-x-2 mt-4">
                    <UButton color="gray" @click="isEditModalOpen = false">ยกเลิก</UButton>
                    <UButton type="submit" color="primary" :disabled="!isFormValid">บันทึก</UButton>
                </div>
            </form>
        </UCard>
    </UModal>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import { ref, onMounted, computed } from 'vue'

dayjs.extend(buddhistEra);
dayjs.locale('th');

interface Room {
    id: number;
    name: string;
}

interface Booking {
    id: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    attendeeCount: number;
    room: Room;
}

interface BookingErrors {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    attendeeCount: string;
}

const toast = useToast()
const { $api } = useNuxtApp()
const bookings = ref<Booking[]>([])
const isEditModalOpen = ref(false)
const editingBooking = ref<Booking>({
    id: 0,
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    attendeeCount: 1,
    room: { id: 0, name: '' }
})

const errors = ref<BookingErrors>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    attendeeCount: '',
})

const columns = [
    { key: 'title', label: 'หัวข้อการประชุม' },
    { key: 'room', label: 'ห้องประชุม' },
    { key: 'startTime', label: 'เริ่มต้น' },
    { key: 'endTime', label: 'สิ้นสุด' },
    { key: 'attendeeCount', label: 'จำนวนผู้เข้าร่วม' },
    { key: 'actions', label: 'Actions' }
]

const formatDateTime = (dateTime: string) => {
    return dayjs(dateTime).add(-7, 'hour').format('D MMM BBBB HH:mm น.')
}

const isFormValid = computed(() => {
    return Object.values(errors.value).every(error => error === '')
})

const validateField = (field: keyof BookingErrors) => {
    errors.value[field] = ''
    switch (field) {
        case 'title':
        case 'description':
            if (!editingBooking.value[field]) {
                errors.value[field] = 'กรุณากรอกข้อมูล'
            }
            break
        case 'startTime':
            if (!editingBooking.value.startTime) {
                errors.value.startTime = 'กรุณาระบุเวลาเริ่มต้น'
            } else if (new Date(editingBooking.value.startTime) >= new Date(editingBooking.value.endTime)) {
                errors.value.startTime = 'เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด'
            }
            break
        case 'endTime':
            if (!editingBooking.value.endTime) {
                errors.value.endTime = 'กรุณาระบุเวลาสิ้นสุด'
            } else if (new Date(editingBooking.value.endTime) <= new Date(editingBooking.value.startTime)) {
                errors.value.endTime = 'เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น'
            }
            break
        case 'attendeeCount':
            if (!editingBooking.value.attendeeCount || editingBooking.value.attendeeCount < 1) {
                errors.value.attendeeCount = 'จำนวนผู้เข้าร่วมต้องมีอย่างน้อย 1 คน'
            }
            break
    }
}

const validateForm = () => {
    validateField('title')
    validateField('description')
    validateField('startTime')
    validateField('endTime')
    validateField('attendeeCount')
    return isFormValid.value
}

async function onFetchMyBooking() {
    try {
        const response = await $api.api.getApiBookingMyBookings({ secure: true })
        if (!response.ok) throw new Error('Failed to fetch bookings')
        const data = await response.json()
        const mappedData = data.map((booking: Booking) => ({
            ...booking,
            startTime: booking.startTime,
            endTime: booking.endTime
        }))
        bookings.value = mappedData
    } catch (error) {
        console.error('Error fetching bookings:', error)
        toast.add({
            title: 'เกิดข้อผิดพลาด',
            description: 'ไม่สามารถโหลดข้อมูลการจองได้ กรุณาลองใหม่อีกครั้ง',
            color: 'red'
        })
    }
}

onMounted(async () => {
    onFetchMyBooking()
})

const isPastBooking = (endTime: string) => {
    return new Date(endTime) < new Date()
}

const openEditModal = (booking: Booking) => {
    editingBooking.value = {
        ...booking,
        startTime: new Date(booking.startTime).toISOString().slice(0, -8),
        endTime: new Date(booking.endTime).toISOString().slice(0, -8),
    }
    errors.value = {
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        attendeeCount: ''
    }
    isEditModalOpen.value = true
}

const updateBooking = async () => {
    if (!validateForm()) return

    try {
        const response = await $api.api.putApiBookingBookingsById(String(editingBooking.value.id), {
            title: editingBooking.value.title,
            description: editingBooking.value.description,
            startTime: dayjs(editingBooking.value.startTime).add(7, 'hour').toISOString(),
            endTime: dayjs(editingBooking.value.endTime).add(7, 'hour').toISOString(),
            attendeeCount: Number(editingBooking.value.attendeeCount)
        }, { secure: true })

        if (!response.ok) throw new Error('Failed to update booking')

        toast.add({
            title: 'อัพเดทสำเร็จ',
            description: 'อัพเดทข้อมูลการจองเรียบร้อยแล้ว',
            color: 'green'
        })

        isEditModalOpen.value = false
        onFetchMyBooking()
    } catch (error) {
        const errorMessage = await getErrorMessage(error)
        toast.add({
            title: 'เกิดข้อผิดพลาด',
            description: errorMessage || 'ไม่สามารถอัพเดทข้อมูลการจองได้ กรุณาลองใหม่อีกครั้ง',
            color: 'red'
        })
    }
}

const cancelBooking = async (id: number) => {
    if (confirm('คุณต้องการยกเลิกการจองหรือไม่?')) {
        try {
            const resCancelBooking = await $api.api.deleteApiBookingBookingsById(String(id), { secure: true })
            if (!resCancelBooking.ok) throw new Error('Failed to cancel booking')
            onFetchMyBooking()
            toast.add({
                title: 'ยกเลิกการจองสำเร็จ',
                description: 'การยกเลิกการจองสำเร็จ',
                color: 'green'
            })
        } catch (error) {
            console.error('Error cancelling booking:', error)
            toast.add({
                title: 'เกิดข้อผิดพลาด',
                description: 'เกิดข้อผิดพลาดในการยกเลิกการจอง',
                color: 'red'
            })
        }
    }
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