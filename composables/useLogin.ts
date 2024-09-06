import { object, string, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

export const useLogin = () => {
  const { $api } = useNuxtApp()
  const toast = useToast()
  const { setToken } = useAuth()
  const router = useRouter()

  const schema = object({
    username: string().required('ชื่อผู้ใช้จำเป็นต้องกรอก'),
    password: string()
      .min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
      .required('รหัสผ่านจำเป็นต้องกรอก')
  })

  type Schema = InferType<typeof schema>

  const state = reactive({
    username: '',
    password: ''
  })

  // Handle login form submission
  const handleLogin = async (event: FormSubmitEvent<Schema>) => {
    try {
      // Validate the form data using Yup schema
      await schema.validate(event.data, { abortEarly: false })
      
      // Send a POST request to the API to log in
      const response = await $api.api.postApiAuthLogin(event.data)

      if (response.ok) {
        // Extract token and message from the API response
        const data = await response.json()
        const { token, message } = data

        // Set the authentication token
        setToken(token)

        // Display a success toast notification
        toast.add({
          title: 'เข้าสู่ระบบสำเร็จ',
          description: message,
          color: 'green'
        })

        // Redirect to the homepage
        router.push('/')
      } else {
        throw new Error(`การเข้าสู่ระบบล้มเหลว: ${response.status}`)
      }
    } catch (error) {
      // Extract the error message from the exception
      const errorMessage = await getErrorMessage(error)
      
      // Log the error to the console
      console.error('Login error:', errorMessage)

      // Display an error toast notification
      toast.add({
        id: 'login-error',
        title: 'การเข้าสู่ระบบล้มเหลว',
        timeout: 5000,
        description: errorMessage,
        color: 'red'
      })
    }
  }

  const getErrorMessage = async (error: unknown): Promise<string> => {
    if (error instanceof Error) {
      return error.message
    } else if (error instanceof Response) {
      try {
        const errorData = await error.json()
        return errorData.message || `ข้อผิดพลาดจากเซิร์ฟเวอร์: ${error.status}`
      } catch {
        return `ข้อผิดพลาดจากเซิร์ฟเวอร์: ${error.status}`
      }
    }
    return "เกิดข้อผิดพลาดที่ไม่คาดคิด"
  }

  return {
    schema,
    state,
    handleLogin
  }
}