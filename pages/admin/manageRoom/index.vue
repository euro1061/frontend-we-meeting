<template>
    <UCard>
        <template #header>
            <h2 class="text-xl font-semibold">จัดการห้องประชุม</h2>
        </template>

        <UButton icon="i-heroicons-plus" label="เพิ่มห้องประชุม" class="mb-4" @click="navigateToAddRoom" />

        <UTable :columns="columns" :rows="rooms" :loading="loading">
            <template #actions-data="{ row }">
                <UButton icon="i-heroicons-pencil-square" color="yellow" variant="ghost" @click="editRoom(row.id)" />
                <UButton icon="i-heroicons-trash" color="red" variant="ghost" @click="deleteRoom(row.id)" />
            </template>
        </UTable>
    </UCard>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const { $api } = useNuxtApp()

interface Room {
    id: number
    name: string
    capacity: number
    description: string
}

const router = useRouter()

const columns = [
    { key: 'name', label: 'ชื่อห้อง' },
    { key: 'capacity', label: 'ความจุ' },
    { key: 'description', label: 'รายละเอียด' },
    { key: 'actions', label: 'Actions' }
]

const rooms = ref<Room[]>([])
const loading = ref(true)

onMounted(async () => {
    try {
        // Fetch rooms data from API
        const response = await $api.api.getApiRoomRooms()

        if(response.ok) {
            const data = await response.json()
            rooms.value = data
        }
    } catch (error) {
        console.error('Error fetching rooms:', error)
    } finally {
        loading.value = false
    }
})

const navigateToAddRoom = () => {
    router.push('/admin/manageRoom/addRoom')
}

const editRoom = (roomId: number) => {
    console.log(`/admin/manageRoom/editRoom/${roomId}`)
    router.push(`/admin/manageRoom/editRoom/${roomId}`)
}

const deleteRoom = async (roomId: number) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบห้องประชุมนี้?')) {
        try {
            // Delete room API call
            await $api.api.deleteApiRoomRoomsById(String(roomId), {secure: true})

            // Remove room from local state
            rooms.value = rooms.value.filter(room => room.id !== roomId)
        } catch (error) {
            console.error('Error deleting room:', error)
        }
    }
}
</script>