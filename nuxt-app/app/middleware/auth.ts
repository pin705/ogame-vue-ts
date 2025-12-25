export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()
  
  // If not logged in and trying to access protected route
  if (!loggedIn.value && to.path !== '/') {
    return navigateTo('/')
  }
  
  // If logged in and trying to access login page
  if (loggedIn.value && to.path === '/') {
    return navigateTo('/overview')
  }
})
