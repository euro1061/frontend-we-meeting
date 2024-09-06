import { ref, computed } from 'vue'

export const useAuth = () => {
  const token = ref('')
  const { $api } = useNuxtApp()

  if (process.client) {
    token.value = localStorage.getItem('auth_token') || ''
  }

  const isAuthenticated = computed(() => !!token.value)

  const setToken = async (newToken: string) => {
    token.value = newToken
    if (process.client) {
      localStorage.setItem('auth_token', newToken)
    }
    await $api.setSecurityData(newToken)
  }

  const clearToken = () => {
    token.value = ''
    if (process.client) {
      localStorage.removeItem('auth_token')
    }
  }

  const logout = async () => {
    clearToken()
    await $api.setSecurityData('')
  }

  return {
    token,
    isAuthenticated,
    setToken,
    clearToken,
    logout
  }
}