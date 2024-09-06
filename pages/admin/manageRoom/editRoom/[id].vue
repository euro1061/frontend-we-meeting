<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-3">
        <UButton color="gray" @click="goBack">ย้อนกลับ</UButton>
        <h2 class="text-xl font-semibold">แก้ไขห้องประชุม</h2>
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
        <img v-if="currentImage" :src="currentImage" alt="Current Room Image"
          class="mb-2 max-w-xs rounded-lg shadow-md" />
        <UInput type="file" @change="handleImageUpload" accept="image/*" />
        <img v-if="imagePreview" :src="imagePreview" alt="New Room Preview"
          class="mt-2 max-w-xs rounded-lg shadow-md" />
      </UFormGroup>

      <div class="flex space-x-4">
        <UButton type="submit" color="primary" :loading="isLoading">
          บันทึกการแก้ไข
        </UButton>
        <UButton type="button" color="gray" @click="resetForm">
          รีเซ็ตฟอร์ม
        </UButton>
      </div>
    </form>
  </UCard>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const { $api } = useNuxtApp()

const route = useRoute()
const router = useRouter()

const form = reactive({
  name: '',
  description: '',
  capacity: '',
  imageFile: null as File | null
})

const currentImage = ref<string | null>(null)
const imagePreview = ref<string | null>(null)
const isLoading = ref(false)

const fetchRoomData = async () => {
  try {
    const response = await $api.api.getApiRoomRoomsById(String(route.params.id))
    if (response.ok) {
      const data = await response.json()
      // console.log
      form.name = data.name
      form.description = data.description
      form.capacity = data.capacity.toString()
      currentImage.value = `http://localhost:3000${data.imageUrl}` // Assuming the API returns an imageUrl field
    }
  } catch (error) {
    console.error('Error fetching room data:', error)
    alert('เกิดข้อผิดพลาดในการดึงข้อมูลห้องประชุม')
  }
}

onMounted(fetchRoomData)

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

    const response = await axios.put(`http://localhost:3000/api/room/rooms/${route.params.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    })

    console.log('Room updated successfully:', response.data)
    alert('แก้ไขห้องประชุมสำเร็จ')
    goBack()
  } catch (error) {
    console.error('Error updating room:', error)
    alert('เกิดข้อผิดพลาดในการแก้ไขห้องประชุม')
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  fetchRoomData() // Fetch original data again
  form.imageFile = null
  imagePreview.value = null
}

const goBack = () => {
  router.push('/admin/manageRoom')
}
</script>