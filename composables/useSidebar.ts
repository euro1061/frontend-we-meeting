// composables/useSidebar.ts
import { ref, watch } from 'vue'

export function useSidebar() {
  const isCollapsed = ref(localStorage.getItem('sidebarCollapsed') === 'true')

  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
  }

  watch(isCollapsed, (newValue) => {
    localStorage.setItem('sidebarCollapsed', newValue.toString())
  })

  return {
    isCollapsed,
    toggleSidebar
  }
}