<template>
    <li class="relative group" :tabindex="tabindex">
        <div @click="handleItemClick"
            class="px-4 py-2 hover:bg-gray-200 text-sm cursor-pointer transition-colors duration-200"
            :class="{ 'bg-blue-100 text-blue-700': isActive(item.to), 'justify-center': isCollapsed }">
            <div class="flex items-center" :class="{'justify-between': !isCollapsed, 'justify-center': isCollapsed}">
                <div class="flex items-center" :class="{ 'justify-center': isCollapsed }">
                    <Icon :name="item.icon" :class="{ 'mr-2': !isCollapsed }" />
                    <span v-if="!isCollapsed">{{ item.label }}</span>
                </div>
                <Icon v-if="item.children && !isCollapsed"
                    :name="isMenuOpen(item.id) ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                    class="transition-transform duration-200 ml-2"
                    :class="{ 'transform rotate-180': isMenuOpen(item.id) }" />
            </div>
        </div>
        <Transition enter-active-class="transition-all duration-300 ease-in-out"
            leave-active-class="transition-all duration-300 ease-in-out" enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-[500px]" leave-from-class="opacity-100 max-h-[500px]"
            leave-to-class="opacity-0 max-h-0">
            <ul v-if="item.children && isMenuOpen(item.id) && !isCollapsed" class="ml-4 overflow-hidden">
                <SidebarMenuItem v-for="child in item.children" :key="child.id" :item="child" :toggle-menu="toggleMenu"
                    :is-menu-open="isMenuOpen" :current-route="currentRoute" :is-collapsed="isCollapsed"
                    :tabindex="isCollapsed ? -1 : 0" />
            </ul>
        </Transition>
        <Transition enter-active-class="transition-all duration-200 ease-out"
            leave-active-class="transition-all duration-150 ease-in" enter-from-class="opacity-0 translate-x-2"
            enter-to-class="opacity-100 translate-x-0" leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 translate-x-2">
            <div v-if="isCollapsed"
                class="absolute left-full top-0 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-50 invisible group-hover:visible">
                {{ item.label }}
                <span v-if="item.children" class="ml-1">▶</span>
            </div>
        </Transition>
    </li>
</template>

<script setup lang="ts">
import type { MenuItem } from '~/composables/useSidebarMenu'

const props = defineProps<{
    item: MenuItem
    toggleMenu: (id: string) => void
    isMenuOpen: (id: string) => boolean
    currentRoute: string
    isCollapsed: boolean
    tabindex: number
}>()

const emit = defineEmits(['focus'])

const router = useRouter()

const handleItemClick = () => {
    if (props.item.children) {
        props.toggleMenu(props.item.id)
    } else if (props.item.to) {
        router.push(props.item.to)
    }
}

const isActive = (itemPath: string | undefined) => {
    if (!itemPath) return false
    return props.currentRoute === itemPath || props.currentRoute.startsWith(itemPath + '/')
}
</script>

<style scoped>
.group:hover .group-hover\:visible {
    visibility: visible;
}
</style>