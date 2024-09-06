import { ref, onMounted, computed } from 'vue'
import { useAsyncData } from '#app'

export interface MenuItem {
    id: string
    label: string
    icon: string
    to?: string
    children?: MenuItem[]
    roles?: string[]
}

export function useSidebarMenu() {
    const { $api } = useNuxtApp()
    const openMenus = ref<Set<string>>(new Set())

    const { data: menuItems, pending, error, refresh } = useAsyncData(
        'menuItems',
        () => $api.api.getApiRoomMeMenu({ secure: true })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch menu items')
                return response.json()
            }),
        {
            server: false,
            lazy: true,
        }
    )

    onMounted(() => {
        if (!menuItems.value) refresh()
    })

    const toggleMenu = (menuId: string) => {
        if (openMenus.value.has(menuId)) {
            openMenus.value.delete(menuId)
        } else {
            openMenus.value.add(menuId)
        }
    }

    const isMenuOpen = computed(() => (menuId: string) => openMenus.value.has(menuId))

    return {
        menuItems,
        isLoading: pending,
        error,
        toggleMenu,
        isMenuOpen,
        refreshMenuItems: refresh
    }
}