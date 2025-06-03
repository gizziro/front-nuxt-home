export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()

  console.log('Auth plugin initialized')
  
  // 앱 시작 시 인증 상태 복원
  authStore.initializeAuth()
  
  // 토큰이 있으면 유효성 검증
  if (authStore.accessToken) {
    await authStore.checkAuth()
  }
})