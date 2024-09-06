export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return // Skip middleware on server-side

  const { isAuthenticated } = useAuth()
  const { userRole } = useUserInfo()

  // ตรวจสอบการมีอยู่ของเส้นทาง
  const router = useRouter()
  const routes = router.getRoutes()
  // const routeExists = routes.some(route => route.path === to.path)

  // if (!routeExists) {
  //   throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
  // }

  if (!isAuthenticated.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  if (isAuthenticated.value && to.path === '/login') {
    return navigateTo('/dashboard')
  }

  // เพิ่มการตรวจสอบสิทธิ์ตามบทบาท
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

  // console.log(requiredRole && !requiredRole.includes(userRole))
  if (requiredRole && !requiredRole.includes(userRole)) {
    return navigateTo('/unauthorized')
  }
})
