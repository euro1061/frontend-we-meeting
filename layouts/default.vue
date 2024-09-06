<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <header class="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div class="flex items-center">
        <button v-if="!isMobile" @click="toggleSidebar"
          class="mr-4 focus:outline-none hover:text-blue-900 transition-all ease-in-out duration-200"
          aria-label="Toggle Sidebar" :aria-expanded="!isCollapsed">
          <Icon name="mdi:menu" size="24" aria-hidden="true" />
        </button>
        <h1 class="text-sm font-extralight">WeMeeting - ระบบจองห้องประชุม</h1>
      </div>
      <span>Version 1.0.0</span>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <aside :class="sidebarClasses" role="navigation" aria-label="Main Navigation">
        <div class="p-4 text-center">
          <h3 class="text-xl font-bold mt-2 mb-2 text-center">{{ isMobile || isCollapsed ? 'WM' : 'ระบบจองห้องประชุม' }}
          </h3>
          <div v-if="!isMobile && !isCollapsed">
            <UAvatar chip-color="green" chip-text="" chip-position="top-right" size="3xl"
              src="https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj"
              alt="Avatar" />
            <div class="text-center font-light text-sm mt-2 text-gray-700">ยินดีต้อนรับ: {{ username }}</div>
          </div>
        </div>
        <UDivider :label="isMobile || isCollapsed ? '' : 'We Meeting'" />
        <nav class="mt-6">
          <ul ref="menuList" @keydown="handleKeyDown">
            <SidebarMenuItem v-for="(item, index) in menuItems" :key="item.id" :item="item" :toggle-menu="toggleMenu"
              :is-menu-open="isMenuOpen" :current-route="currentRoute.path" :is-collapsed="isMobile || isCollapsed"
              :tabindex="isMobile || isCollapsed ? -1 : 0" @focus="currentFocusIndex = index" />
          </ul>
        </nav>
      </aside>

      <!-- Main content area -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebarMenu } from '~/composables/useSidebarMenu'
import { useSidebar } from '~/composables/useSidebar'
import SidebarMenuItem from '~/components/layout/SidebarMenuItem.vue'
const { username, fetchUserInfo } = useUserInfo()

const { $api } = useNuxtApp()
const { menuItems, toggleMenu, isMenuOpen } = useSidebarMenu()
const { isCollapsed, toggleSidebar } = useSidebar()
const currentRoute = useRoute()

const menuList = ref<HTMLUListElement | null>(null)
const currentFocusIndex = ref(0)
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  fetchUserInfo()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const sidebarClasses = computed(() => [
  isMobile.value || isCollapsed.value ? 'w-16' : 'w-64',
  'bg-white shadow-md transition-all duration-300',
  'h-full'
])

const handleKeyDown = (event: KeyboardEvent) => {
  const menuItems = menuList.value?.querySelectorAll('li')
  if (!menuItems) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      currentFocusIndex.value = (currentFocusIndex.value + 1) % menuItems.length
        ; (menuItems[currentFocusIndex.value] as HTMLElement).focus()
      break
    case 'ArrowUp':
      event.preventDefault()
      currentFocusIndex.value = (currentFocusIndex.value - 1 + menuItems.length) % menuItems.length
        ; (menuItems[currentFocusIndex.value] as HTMLElement).focus()
      break
  }
}
</script>

<style scoped>
/* เพิ่ม CSS เพื่อจัดการ overflow ที่อาจเกิดขึ้น */
.overflow-x-hidden {
  overflow-x: hidden;
}
</style>