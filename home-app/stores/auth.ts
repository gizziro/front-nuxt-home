import type { LoginRequest, LoginUser } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const config          = useRuntimeConfig();
  const authUser        = ref<Maybe<LoginUser>>(null)
  const accessToken     = ref<Maybe<string>>(null)
  const refreshToken    = ref<Maybe<string>>(null)
  const isAuthenticated = computed(() => !!accessToken.value)
  const isLoading       = ref(false)


  const socialSignIn = (response :ApiResponse<LoginUser>) => {
    if (response.success && response.data) 
    {
      const loginData = response.data
      
      // 토큰과 사용자 정보 저장
      accessToken.value     = loginData.token.accessToken
      refreshToken.value    = loginData.token.refreshToken
      
      localStorage.setItem('access-token', loginData.token.accessToken)
      localStorage.setItem('refresh-token', loginData.token.refreshToken)
      localStorage.setItem('user', JSON.stringify(loginData))

      navigateTo('/')
    }
  }


  const signIn = async (userId: string, password: string) => {

    try {
      //----------------------------------------------------------------------------------------------------
      // 로그인 요청
      //----------------------------------------------------------------------------------------------------
      const response = await $fetch<ApiResponse<LoginUser>>('/api/v1/auth/login', {
                            baseURL: config.public.apiBase,
                            method: 'POST',
                            body: {
                              userId,
                              password,
                            },
                          })



        if (response.success && response.data) 
        {
          const loginData = response.data
          
          // 토큰과 사용자 정보 저장
          accessToken.value     = loginData.token.accessToken
          refreshToken.value    = loginData.token.refreshToken
          
          localStorage.setItem('access-token', loginData.token.accessToken)
          localStorage.setItem('refresh-token', loginData.token.refreshToken)
          localStorage.setItem('user', JSON.stringify(loginData))

          await navigateTo('/')
        }
        else {
          throw new Error(response.error || '로그인에 실패했습니다.')
        }
    } catch (error: any) {
      console.error('Login error:', error)
      
      // API 에러 처리
      if (error.response?.status === 401) {
        throw new Error('아이디 또는 비밀번호가 잘못되었습니다.')
      } else if (error.response?.status === 423) {
        throw new Error('계정이 잠겨있습니다. 관리자에게 문의하세요.')
      } else if (error.response?._data?.error) {
        throw new Error(error.response._data.error)
      } else {
        throw new Error('로그인 중 오류가 발생했습니다.')
      }
    } finally {
      isLoading.value = false
    }
  };

  
  const signOut = async (): Promise<void> => {
    authUser.value = null
    accessToken.value = null
    refreshToken.value = null
    
    localStorage.removeItem('access-token')
    localStorage.removeItem('refresh-token')
    localStorage.removeItem('user')
    
    // 쿠키 제거
    // const accessTokenCookie = useCookie('access-token')
    // const refreshTokenCookie = useCookie('refresh-token')
    // accessTokenCookie.value = null
    // refreshTokenCookie.value = null
    
    await navigateTo('/login')
  }


  const initializeAuth = (): void => {
    // localStorage에서 사용자 정보 복원 (클라이언트에서만)
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        authUser.value = JSON.parse(savedUser)
      } catch (error) {
        console.error('Failed to parse saved user:', error)
      }
    }
    accessToken.value   = localStorage.getItem('access-token')
    refreshToken.value  = localStorage.getItem('refresh-token')

    
    // // 쿠키에서 토큰 복원
    // const accessTokenCookie   = useCookie('access-token')
    // const refreshTokenCookie  = useCookie('refresh-token')
    
    // if (accessTokenCookie.value && refreshTokenCookie.value) 
    // {
    //   accessToken.value   = accessTokenCookie.value
    //   refreshToken.value   = refreshTokenCookie.value
      
      
    // }
  }

    const refreshAccessToken = async (): Promise<boolean> => {
    if (!refreshToken.value) return false
    
    try {
      const config = useRuntimeConfig()
      
      const response = await $fetch<ApiResponse<{ accessToken: string }>>('/auth/refresh', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: {
          refreshToken: refreshToken.value
        }
      })

      if (response.success && response.data) {
        accessToken.value = response.data.accessToken
        
        // 새 토큰을 저장
        if (process.client) {
          localStorage.setItem('access-token', response.data.accessToken)
        }
        
        const accessTokenCookie = useCookie('access-token')
        accessTokenCookie.value = response.data.accessToken
        
        return true
      } else {
        await signOut()
        return false
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      await signOut()
      return false
    }
  }


    const checkAuth = async (): Promise<boolean> => {
    if (!accessToken.value) return false
    
    try {
      const config = useRuntimeConfig()
      
      // 토큰 유효성 검증 API 호출
      const response = await $fetch<ApiResponse<LoginUser>>('/auth/me', {
        baseURL: config.public.apiBase,
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      })

      if (response.success && response.data) {
        authUser.value = response.data
        return true
      } else {
        // Access Token이 만료된 경우 Refresh Token으로 갱신 시도
        return await refreshAccessToken()
      }
    } catch (error: any) {
      console.error('Auth check failed:', error)
      
      // 401 에러인 경우 토큰 갱신 시도
      if (error.response?.status === 401) {
        return await refreshAccessToken()
      }
      
      await signOut()
      return false
    }
  }

  return {
      user: authUser,
      isAuthenticated,
      initializeAuth,
      accessToken,
      refreshToken,
      checkAuth,
      signIn,
      socialSignIn,
      signOut,
  };
});
