<template>
    <UCard class="max-w-2xl mx-auto">
        <template #header>
            <h1 class="text-2xl font-bold">เปลี่ยนรหัสผ่าน</h1>
        </template>

        <UForm :state="form" @submit="onSubmit">
            <UFormGroup label="รหัสผ่านปัจจุบัน" name="currentPassword" class="mb-4" required>
                <UInput v-model="form.currentPassword" type="password" />
            </UFormGroup>

            <UFormGroup label="รหัสผ่านใหม่" name="newPassword" class="mb-4" required>
                <UInput v-model="form.newPassword" type="password" />
            </UFormGroup>

            <UFormGroup label="ยืนยันรหัสผ่านใหม่" name="confirmNewPassword" class="mb-4" required>
                <UInput v-model="form.confirmNewPassword" type="password" />
            </UFormGroup>

            <UButton icon="mdi:lock-reset" type="submit" color="primary" class="mt-6" :disabled="!isFormValid">
                เปลี่ยนรหัสผ่าน
            </UButton>
        </UForm>
    </UCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const { $api } = useNuxtApp()
const toast = useToast()

const form = ref({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
})

const isFormValid = computed(() => {
    return form.value.currentPassword.trim() !== '' &&
        form.value.newPassword.trim() !== '' &&
        form.value.confirmNewPassword.trim() !== '' &&
        form.value.newPassword === form.value.confirmNewPassword
})

const onSubmit = async () => {
    if (!isFormValid.value) {
        toast.add({
            title: 'ข้อผิดพลาดในการตรวจสอบ',
            description: 'กรุณากรอกข้อมูลให้ครบถ้วนและตรวจสอบว่ารหัสผ่านใหม่ตรงกัน',
            color: 'red'
        })
        return
    }

    try {
        // เรียกใช้ API เพื่อเปลี่ยนรหัสผ่าน
        const response = await $api.api.putApiRoomChangePassword({
            currentPassword: form.value.currentPassword,
            newPassword: form.value.newPassword
        }, { secure: true })

        if (response.ok) {
            const data = await response.json()
            console.log(data)
            toast.add({
                title: 'สำเร็จ',
                description: 'รหัสผ่านของคุณถูกเปลี่ยนแล้ว',
                color: 'green'
            })
        }
        // รีเซ็ตฟอร์ม
        form.value = {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน:', error)
        const errorMessage = await getErrorMessage(error)
        toast.add({
            title: 'ข้อผิดพลาด',
            description: errorMessage,
            color: 'red'
        })
    }
}

const getErrorMessage = async (error: unknown): Promise<string> => {
    if (error instanceof Error) {
        return error.message
    } else if (error instanceof Response) {
        try {
            const errorData = await error.json()
            return errorData.message || `ข้อผิดพลาดจากเซิร์ฟเวอร์: ${error.status}`
        } catch {
            return `ข้อผิดพลาดจากเซิร์ฟเวอร์: ${error.status}`
        }
    }
    return "เกิดข้อผิดพลาดที่ไม่คาดคิด"
}
</script>