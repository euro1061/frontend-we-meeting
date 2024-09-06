<template>
    <UCard class="max-w-2xl mx-auto">
        <template #header>
            <h1 class="text-2xl font-bold">ข้อมูลส่วนตัว</h1>
        </template>

        <UForm :state="form" @submit="onSubmit">
            <UFormGroup label="Username" name="username" class="mb-4">
                <UInput v-model="form.username" disabled />
            </UFormGroup>

            <UFormGroup label="First Name" name="firstName" class="mb-4" required>
                <UInput v-model="form.firstName" />
            </UFormGroup>

            <UFormGroup label="Last Name" name="lastName" class="mb-4" required>
                <UInput v-model="form.lastName" />
            </UFormGroup>

            <UFormGroup label="Nickname" name="nickname" class="mb-4">
                <UInput v-model="form.nickname" placeholder="ชื่อเล่น" />
            </UFormGroup>

            <UFormGroup label="Phone" name="phone" class="mb-4">
                <UInput v-model="form.phone" placeholder="เบอร์โทร" />
            </UFormGroup>

            <UFormGroup label="Email" name="email" class="mb-4">
                <UInput v-model="form.email" type="email" placeholder="Email" />
            </UFormGroup>

            <UButton icon="mdi:content-save" type="submit" color="primary" class="mt-6" :disabled="!isFormValid">
                อัพเดทข้อมูล
            </UButton>
        </UForm>
    </UCard>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const { $api } = useNuxtApp()
const toast = useToast()

const form = ref({
    username: '',
    firstName: '',
    lastName: '',
    nickname: '',
    phone: '',
    email: ''
})

const isFormValid = computed(() => {
    return form.value.firstName.trim() !== '' && form.value.lastName.trim() !== ''
})

const fetchUserProfile = async () => {
    try {
        const response = await $api.api.getApiRoomMe({ secure: true })
        if (response.ok) {
            const data = await response.json()
            Object.assign(form.value, data)
        }
    } catch (error) {
        console.error('Error fetching user profile:', error)
        toast.add({
            title: 'Error',
            // description: 'Failed to load user profile',
            description: 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้',
            color: 'red'
        })
    }
}

const onSubmit = async () => {
    if (!isFormValid.value) {
        toast.add({
            title: 'Validation Error',
            // description: 'Please fill in all required fields',
            description: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            color: 'yellow'
        })
        return
    }

    try {
        // Replace this with your actual API call
        const resUpdateProfile = await $api.api.putApiRoomUpdateProfile({
            email: form.value.email,
            firstName: form.value.firstName,
            lastName: form.value.lastName,
            nickname: form.value.nickname,
            phone: form.value.phone || ''
        }, { secure: true })

        if (!resUpdateProfile.ok) {
            throw new Error('Failed to update profile')
        }
        toast.add({
            title: 'Success',
            // description: 'Profile updated successfully',
            description: 'อัพเดทข้อมูลเรียบร้อยแล้ว',
            color: 'green'
        })
    } catch (error) {
        console.error('Error updating profile:', error)
        toast.add({
            title: 'Error',
            // description: 'Failed to update profile',
            description: 'ไม่สามารถอัพเดทข้อมูลได้',
            color: 'red'
        })
    }
}

onMounted(() => {
    fetchUserProfile()
})
</script>