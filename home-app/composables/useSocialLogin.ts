import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

export const useSocialLogin = () => {
  const config = useRuntimeConfig()
  const toast = useToast()
  const loading = ref(false)

  // 카카오 로그인 URL 생성
  const createKakaoAuthUrl = () => {
    // 카카오 개발자 센터에 등록한 Redirect URI
    const redirectUri = `${window.location.origin}/oauth/callback/kakao`
    
    // 카카오 인증 URL
    const kakaoAuthUrl = 'https://kauth.kakao.com/oauth/authorize'
    
    // 쿼리 파라미터 구성
    const url = new URL(kakaoAuthUrl)
    
    // kakaoClientId 설정
    const clientId = String(config.public.kakaoClientId || '')
    
    url.searchParams.append('client_id', clientId)
    url.searchParams.append('redirect_uri', redirectUri)
    url.searchParams.append('response_type', 'code')
    
    // 상태 값 생성 (CSRF 방지)
    const state = Math.random().toString(36).substring(2, 15)
    url.searchParams.append('state', state)
    
    // 로컬 스토리지에 상태 값 저장
    localStorage.setItem('oauth_state', state)
    
    return url.toString()
  }

  // 다른 소셜 로그인 URL 생성 (백엔드 전달 방식)
  const createOAuthUrl = (provider: string) => {
    // 현재 API 서버의 OAuth 엔드포인트
    return `${config.public.apiBase}/api/v1/oauth2/authorization/${provider.toLowerCase()}`
  }

  // 카카오 로그인 리다이렉트
  const redirectToKakao = () => {
    loading.value = true

    try {
      // 카카오 인증 URL 생성
      const kakaoUrl = createKakaoAuthUrl()
      
      // 해당 URL로 리다이렉트
      window.location.href = kakaoUrl
    } catch (error) {
      console.error('카카오 로그인 오류:', error)
      toast.add({ 
        severity: 'error', 
        summary: '소셜 로그인 오류', 
        detail: '카카오 로그인 처리 중 오류가 발생했습니다.', 
        life: 3000 
      })
      loading.value = false
    }
  }

  // 다른 소셜 로그인 리다이렉트 (백엔드 전달 방식)
  const redirectToProvider = (provider: string) => {
    loading.value = true

    try {
      // 현재 URL을 리다이렉트 URL로 설정
      const redirectUri = `${window.location.origin}/oauth/callback`
      
      // OAuth URL 생성
      const oauthUrl = createOAuthUrl(provider)
      
      // 쿼리 파라미터 추가
      const url = new URL(oauthUrl)
      url.searchParams.append('redirect_uri', redirectUri)
      
      // 상태 값 생성 (CSRF 방지)
      const state = Math.random().toString(36).substring(2, 15)
      url.searchParams.append('state', state)
      
      // 로컬 스토리지에 상태 값 저장
      localStorage.setItem('oauth_state', state)
      
      // 해당 URL로 리다이렉트
      window.location.href = url.toString()
    } catch (error) {
      console.error(`${provider} 로그인 오류:`, error)
      toast.add({ 
        severity: 'error', 
        summary: '소셜 로그인 오류', 
        detail: `${provider} 로그인 처리 중 오류가 발생했습니다.`, 
        life: 3000 
      })
      loading.value = false
    }
  }

  // 소셜 로그인 함수
  const loginWithKakao = () => {
    redirectToKakao()
  }

  const loginWithNaver = () => {
    redirectToProvider('NAVER')
  }

  const loginWithGithub = () => {
    redirectToProvider('GITHUB')
  }

  const loginWithGoogle = () => {
    redirectToProvider('GOOGLE')
  }

  return {
    loading,
    loginWithKakao,
    loginWithNaver,
    loginWithGithub,
    loginWithGoogle
  }
} 