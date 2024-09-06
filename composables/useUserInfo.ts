// composables/useUserInfo.ts
import { ref } from 'vue'

interface UserInfo {
  username: string
  userRole: string
  fetchUserInfo: () => Promise<void>
  isAuthenticated: boolean
}

export const useUserState = () => useState<UserInfo>('UserInfo', () => ({
  username: '',
  userRole: '',
  fetchUserInfo: async () => { },
  isAuthenticated: false
}))


export function useUserInfo() {
  const { isAuthenticated } = useAuth() // ใช้ isAuthenticated จาก useAuth
  const userState = useUserState() // ใช้ username และ userRole จาก useUserState

  const fetchUserInfo = async () => {
    const { $api } = useNuxtApp()
    try {
      const response = await $api.api.getApiRoomMe({ secure: true })
      if (response.ok) {
        const data = await response.json()
        userState.value.userRole = String(data.role).toLocaleLowerCase()
        userState.value.username = data.username
        localStorage.setItem('userRole', userState.value.userRole)
      } else {
        console.error('Failed to fetch user info')
      }
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  // เพิ่มฟังก์ชันนี้
  const getUserRole = () => {
    return userState.value.userRole || localStorage.getItem('userRole') || ''
  }

  return {
    userRole: getUserRole(),
    username: userState.value.username,
    fetchUserInfo,
    isAuthenticated
  }
}