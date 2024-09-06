<template>
    <button
      :class="[
        'px-4 py-2 rounded-md font-bold w-full',
        variantClasses,
        sizeClasses,
        { 'opacity-50 cursor-not-allowed': disabled }
      ]"
      :disabled="disabled"
      @click="$emit('click', $event)"
    >
      <slot />
    </button>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  interface Props {
    variant?: 'primary' | 'secondary' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
  }
  
  const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    disabled: false
  })
  
  const variantClasses = computed(() => ({
    'bg-white border text-blue-600 hover:bg-blue-600 hover:text-white': props.variant === 'primary'
  }))
  
  const sizeClasses = computed(() => ({
    'text-sm': props.size === 'sm',
    'text-base': props.size === 'md',
    'text-lg': props.size === 'lg'
  }))
  
  defineEmits(['click'])
  </script>