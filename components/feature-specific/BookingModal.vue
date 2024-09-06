<!-- components/BookingModal.vue -->
<template>
    <UModal v-model="isOpen" :ui="{
        width: 'w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl',
    }">
        <UCard>
            <template #header>
                <h3 class="text-lg font-semibold">จองห้องประชุม: {{ room.name }}</h3>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- ข้อมูลห้อง -->
                <div>
                    <img :src="room.imageUrl" :alt="room.name" class="w-full h-48 object-cover rounded-lg mb-4">
                    <p class="font-semibold">{{ room.name }}</p>
                    <p>{{ room.description }}</p>
                    <p>ความจุ: {{ room.capacity }} คน</p>
                </div>
                <!-- ฟอร์มการจอง -->
                <div>
                    <UForm :state="formState" @submit="onSubmit">
                        <UFormGroup label="วันที่จอง" name="bookingDate" :error="validateField('bookingDate')">
                            <UInput v-model="formState.bookingDate" type="date" :min="today" required
                                @blur="setFieldTouched('bookingDate')" />
                        </UFormGroup>
                        <UFormGroup label="เวลาเริ่มต้น" name="startTime" :error="validateField('startTime')">
                            <USelect v-model="formState.startTime" :options="timeOptions" required
                                @blur="setFieldTouched('startTime')" />
                        </UFormGroup>
                        <UFormGroup label="เวลาสิ้นสุด" name="endTime" :error="validateField('endTime')">
                            <USelect v-model="formState.endTime" :options="timeOptions" required
                                @blur="setFieldTouched('endTime')" />
                        </UFormGroup>
                        <UFormGroup label="หัวข้อการประชุม" name="title" :error="validateField('title')">
                            <UInput v-model="formState.title" required @blur="setFieldTouched('title')" />
                        </UFormGroup>
                        <UFormGroup label="รายละเอียดการประชุม" name="description"
                            :error="validateField('description')">
                            <UTextarea v-model="formState.description" required
                                @blur="setFieldTouched('description')" />
                        </UFormGroup>
                        <UFormGroup label="จำนวนผู้เข้าร่วม" name="attendeeCount"
                            :error="validateField('attendeeCount')">
                            <UInput v-model="formState.attendeeCount" type="number" :min="1" :max="room.capacity"
                                required @blur="setFieldTouched('attendeeCount')" />
                        </UFormGroup>
                        <UButton type="submit" block icon="mdi:add" class="mt-3" color="primary" :loading="isLoading"
                            :disabled="!isFormValid">
                            ยืนยันการจอง
                        </UButton>
                    </UForm>
                </div>
            </div>
        </UCard>
    </UModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'

const { timeOptions } = useTimeOptions()

const props = defineProps<{
    isOpen: boolean
    room: {
        id: number
        name: string
        description: string
        capacity: number
        imageUrl: string
    }
    defaultDate: string
    defaultStartTime: string | ''
    defaultEndTime: string | ''
}>()

const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void
    (e: 'book', bookingData: any): void
}>()

const resetForm = () => {
    formState.value = {
        bookingDate: dayjs(props.defaultDate).format('YYYY-MM-DD'),
        startTime: props.defaultStartTime,
        endTime: props.defaultEndTime,
        title: '',
        description: '',
        attendeeCount: 1
    }
    touchedFields.value = {}
    formErrors.value = {}
}

const isOpen = computed({
    get: () => props.isOpen,
    set: (value) => emit('update:isOpen', value)
})

const today = computed(() => dayjs().format('YYYY-MM-DD'))

const formState = ref({
    bookingDate: dayjs(props.defaultDate).format('YYYY-MM-DD'),
    startTime: props.defaultStartTime,
    endTime: props.defaultEndTime,
    title: '',
    description: '',
    attendeeCount: 1
})

// watch props changes
watch(() => props.defaultDate, (newDate) => {
    formState.value.bookingDate = dayjs(newDate).format('YYYY-MM-DD')
})

watch(() => props.defaultStartTime, (newStartTime) => {
    formState.value.startTime = newStartTime
})

watch(() => props.defaultEndTime, (newEndTime) => {
    formState.value.endTime = newEndTime
})

const isLoading = ref(false)

interface FormErrors {
    [key: string]: string;
}

interface TouchedFields {
    [key: string]: boolean;
}

const touchedFields = ref<TouchedFields>({})
const formErrors = ref<FormErrors>({})

const validateForm = () => {
    const errors: FormErrors = {}
    if (touchedFields.value.bookingDate && !formState.value.bookingDate) {
        errors['bookingDate'] = 'กรุณาเลือกวันที่จอง'
    }
    if (touchedFields.value.startTime && !formState.value.startTime) {
        errors['startTime'] = 'กรุณาเลือกเวลาเริ่มต้น'
    }
    if (touchedFields.value.endTime && !formState.value.endTime) {
        errors['endTime'] = 'กรุณาเลือกเวลาสิ้นสุด'
    }
    if (touchedFields.value.endTime && touchedFields.value.startTime &&
        formState.value.startTime && formState.value.endTime &&
        formState.value.startTime >= formState.value.endTime) {
        errors['endTime'] = 'เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น'
    }
    if (touchedFields.value.title && !formState.value.title.trim()) {
        errors['title'] = 'กรุณากรอกหัวข้อการประชุม'
    }
    if (touchedFields.value.description && !formState.value.description.trim()) {
        errors['description'] = 'กรุณากรอกรายละเอียดการประชุม'
    }
    if (touchedFields.value.attendeeCount &&
        (!formState.value.attendeeCount || formState.value.attendeeCount < 1 ||
            formState.value.attendeeCount > props.room.capacity)) {
        errors['attendeeCount'] = `กรุณากรอกจำนวนผู้เข้าร่วมระหว่าง 1 ถึง ${props.room.capacity}`
    }
    formErrors.value = errors
    return Object.keys(errors).length === 0
}

const validateField = (fieldName: string): string | undefined => {
    return touchedFields.value[fieldName] ? formErrors.value[fieldName] : undefined
}

const isFormValid = computed(() => {
    return validateForm()
})

const setFieldTouched = (fieldName: string) => {
    touchedFields.value[fieldName] = true
    validateForm()
}

watch(formState, () => {
    validateForm()
}, { deep: true })

const onSubmit = async () => {
    if (!isFormValid.value) return

    isLoading.value = true
    // TODO: Implement booking logic here
    // await new Promise(resolve => setTimeout(resolve, 1000)) // Simulating API call
    emit('book', { ...formState.value, roomId: props.room.id })
    isLoading.value = false
    isOpen.value = false
    resetForm()
}
</script>