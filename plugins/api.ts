import { Api } from '~/utils/myApi'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const api = new Api({
    baseUrl: config.public.apiBaseUrl,
    securityWorker: (token) => {
      console.log('Security worker called with token:', token)
      return token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    },
    customFetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await fetch(input, init);

      if (!response.ok) {
        throw response;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        return new Response(JSON.stringify(data), {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      } else {
        return response;
      }
    }
  })

  if (process.client) {
    const storedToken = localStorage.getItem('auth_token')
    if (storedToken) {
      api.setSecurityData(storedToken)
    }
  }

  return {
    provide: {
      api
    }
  }
})