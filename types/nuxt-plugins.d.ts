import { Api } from '~/utils/myApi'
import { AxiosInstance } from 'axios'

declare module '#app' {
  interface NuxtApp {
    $api: Api<unknown>
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: Api<unknown>
  }
}

export {}