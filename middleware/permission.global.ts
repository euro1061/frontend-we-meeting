export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return // ข้ามการทำงานบน server-side

  const { isAuthenticated, userRole } = useUserInfo() // สมมติว่ามีฟังก์ชัน useUserInfo ที่ให้ข้อมูลบทบาทของผู้ใช้

  // กำหนดการเข้าถึงหน้าต่างๆ ตามบทบาท
  const routePermissions: {
    [key: string]: string[]
  } = {
    '/calendar': ['user', 'admin'],
    '/booking': ['user', 'admin'],
    '/my-booking': ['user', 'admin'],
    '/profile': ['user', 'admin'],
    '/change-password': ['user', 'admin'],
    '/admin/manageRoom': ['admin'],
    '/logout': ['user', 'admin']
  }

  const requiredRole = routePermissions[to.path]

  if (requiredRole && (!isAuthenticated.value || !requiredRole.includes(userRole))) {
    // ถ้าไม่มีสิทธิ์เข้าถึง ให้ redirect ไปหน้า login หรือหน้าแจ้งเตือน
    return navigateTo('/login')
  }
})
