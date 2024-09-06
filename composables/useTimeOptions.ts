// composables/useTimeOptions.ts
import { computed } from 'vue'

export function useTimeOptions() {
  const timeOptions = computed(() => {
    const options = []
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hour = i.toString().padStart(2, '0')
        const minute = j.toString().padStart(2, '0')
        const ampm = i < 12 ? 'AM' : 'PM'
        const hour12 = i % 12 || 12
        const label = `${hour}:${minute} (${hour12}:${minute} ${ampm})`
        const value = `${hour}:${minute}`
        options.push({ label, value })
      }
    }
    return options
  })

  return { timeOptions }
}