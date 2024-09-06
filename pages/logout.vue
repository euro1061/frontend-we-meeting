<template>
    <div>
        <h1>Logout</h1>
        <p>Logging out...</p>
    </div>
</template>

<script setup lang="ts">
const { logout } = useAuth()
const router = useRouter()
const toast = useToast()
logout()
router.push('/')
toast.add({
    id: 'logout-success',
    title: 'Logged out',
    description: "ออกจากระบบสำเร็จ",
    color: 'red'
})
</script>