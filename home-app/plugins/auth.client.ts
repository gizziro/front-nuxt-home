export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore()

  console.log('Auth plugin initialized')
  
  // 앱이 마운트된 후에 인증 상태 복원
  nuxtApp.hook('app:mounted', async () => {
    console.log('App mounted, initializing auth...')
    
    // initializeAuth 메서드 사용 (이미 store에 구현되어 있음)
    authStore.initializeAuth()
    
    // 토큰이 있으면 유효성 검증
    if (authStore.accessToken) {
      console.log('Found access token, checking auth...')
      try {
        await authStore.checkAuth()
      } catch (error) {
        console.error('Auth check failed:', error)
        // API 서버 연결 실패 등의 이유로 인증 체크가 실패해도
        // 로컬에 저장된 토큰이 있다면 로그인 상태 유지
        if (authStore.accessToken) {
          console.log('Keeping local auth state despite check failure')
        }
      }
    }
  })
})