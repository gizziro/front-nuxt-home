export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  
  // 이미 로그인한 사용자가 로그인/회원가입 페이지 접근 시
  if (authStore.isAuthenticated) {
    return navigateTo('/dashboard')
  }
})