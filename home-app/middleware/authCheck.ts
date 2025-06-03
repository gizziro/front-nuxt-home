export default defineNuxtRouteMiddleware((to) => {
const authStore = useAuthStore()
  
  // 인증이 필요한 페이지에서 로그인하지 않은 경우
  if (!authStore.isAuthenticated) 
  {
    return navigateTo('/login')
  }
})