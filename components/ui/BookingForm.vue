<!-- components/BookingForm.vue -->
<template>
    <UCard class="mb-4">
        <UForm :state="formState" @submit="onSubmit">
            <div class="flex flex-wrap -mx-2">
                <div class="w-full md:w-2/6 px-2 mb-4 md:mb-0">
                    <UFormGroup label="วันที่จอง" name="bookingDate" :error="isDateTouched ? dateError : ''">
                        <UInput v-model="formState.bookingDate" type="date" :min="today" />
                    </UFormGroup>
                </div>
                <div class="w-full md:w-1/6 px-2 mb-4 md:mb-0">
                    <UFormGroup label="เวลาเริ่มต้น" name="startTime" :error="isStartTimeTouched ? startTimeError : ''">
                        <USelect v-model="formState.startTime" :options="timeOptions" />
                    </UFormGroup>
                </div>
                <div class="w-full md:w-1/6 px-2 mb-4 md:mb-0">
                    <UFormGroup label="เวลาสิ้นสุด" name="endTime" :error="isEndTimeTouched ? endTimeError : ''">
                        <USelect v-model="formState.endTime" :options="timeOptions" />
                    </UFormGroup>
                </div>
                <div class="w-full md:w-1/6 px-2 flex items-center">
                    <UFormGroup class="w-full" label=" ">
                        <UButton type="submit" size="lg" icon="mdi:search" color="primary" :loading="isLoading"
                            :disabled="!isFormValid" block>
                            ค้นหาห้องว่าง
                        </UButton>
                    </UFormGroup>
                </div>
                <div class="w-full md:w-1/6 px-2 flex items-center">
                    <UFormGroup class="w-full" label=" ">
                        <UButton type="submit" size="lg" icon="mdi:restart" color="gray" :loading="isLoading" block @click="onResetFinal">
                            RESET
                        </UButton>
                    </UFormGroup>
                </div>
            </div>
        </UForm>
    </UCard>
</template>

<script setup lang="ts">
import { useBookingForm } from '~/composables/useBookingForm'
const { resetResult } = useBookingActions()

const { formState, isLoading, today, dateError, startTimeError, endTimeError, isFormValid, timeOptions, searchAvailableRooms,onResetField, isDateTouched, isStartTimeTouched, isEndTimeTouched } = useBookingForm()

const emit = defineEmits(['search'])

const onResetFinal = () => {
    onResetField()
    resetResult()
}

function onSubmit() {
    searchAvailableRooms()
    emit('search')
}
</script>