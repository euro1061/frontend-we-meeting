<template>
    <UCard>
        <template #header>
            <div class="flex items-center gap-2">
                <UButton color="gray" @click="goBack">ย้อนกลับ</UButton>
                <UDivider orientation="vertical" />
                <h2 class="text-xl font-semibold">เพิ่มห้องประชุม</h2>
            </div>
        </template>
        <form @submit.prevent="submitForm" class="space-y-4">
            <UFormGroup label="ชื่อห้องประชุม" required>
                <UInput v-model="form.name" placeholder="กรอกชื่อห้องประชุม" />
            </UFormGroup>

            <UFormGroup label="รายละเอียดห้องประชุม">
                <UTextarea v-model="form.description" placeholder="กรอกรายละเอียดห้องประชุม" />
            </UFormGroup>

            <UFormGroup label="ความจุห้องประชุม" required>
                <UInput v-model="form.capacity" type="number" min="1" placeholder="กรอกจำนวนคนที่รองรับ" />
            </UFormGroup>

            <UFormGroup label="รูปห้องประชุม">
                <UInput type="file" @change="handleImageUpload" accept="image/*" />
                <img v-if="imagePreview" :src="imagePreview" alt="Room Preview"
                    class="mt-2 max-w-xs rounded-lg shadow-md" />
            </UFormGroup>

            <div class="flex space-x-4">
                <UButton type="submit" color="primary" :loading="isLoading">
                    เพิ่มห้องประชุม
                </UButton>
                <UButton type="button" color="gray" @click="resetForm">
                    รีเซ็ตฟอร์ม
                </UButton>
            </div>
        </form>
    </UCard>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import axios from 'axios'

const form = reactive({
    name: '',
    description: '',
    capacity: '',
    imageFile: null as File | null
})

const imagePreview = ref<string | null>(null)
const isLoading = ref(false)

const handleImageUpload = (files: File[]) => {
  if (files && files.length > 0) {
    const file = files[0]
    form.imageFile = file
    imagePreview.value = URL.createObjectURL(file)
  } else {
    form.imageFile = null
    imagePreview.value = null
  }
}

const submitForm = async () => {
    if (!form.name || !form.capacity) {
        alert('กรุณากรอกข้อมูลที่จำเป็น')
        return
    }

    isLoading.value = true

    try {
        const formData = new FormData()
        formData.append('name', form.name)
        formData.append('description', form.description)
        formData.append('capacity', form.capacity)
        if (form.imageFile instanceof File) {
            formData.append('imageFile', form.imageFile, form.imageFile.name)
        }

        const token = localStorage.getItem('auth_token')

        const response = await axios.post('http://localhost:3000/api/room/rooms', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })

        console.log('Room added successfully:', response.data)
        resetForm()
        alert('เพิ่มห้องประชุมสำเร็จ')
        navigateTo('/admin/manageRoom')
    } catch (error) {
        console.error('Error adding room:', error)
        alert('เกิดข้อผิดพลาดในการเพิ่มห้องประชุม')
    } finally {
        isLoading.value = false
    }
}

const resetForm = () => {
    Object.assign(form, { name: '', description: '', capacity: '', imageFile: null })
    imagePreview.value = null
}

const goBack = () => {
    navigateTo('/admin/manageRoom')
}
</script>