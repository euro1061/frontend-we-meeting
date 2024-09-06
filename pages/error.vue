<script setup>
const error = useError()
const router = useRouter()

const handleError = () => {
  if (error.value?.statusCode === 404) {
    router.push('/login')
  } else {
    clearError({ redirect: '/login' })
  }
}

onMounted(() => {
  handleError()
})
</script>

<template>
  <div>
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.message }}</p>
    <button @click="handleError">Go to Login</button>
  </div>
</template>