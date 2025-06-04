import type { LoginRequest, LoginUser } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const config          = useRuntimeConfig();
  const authUser        = ref<Maybe<LoginUser>>(null)
  const accessToken     = ref<Maybe<string>>(null)
  const refreshToken    = ref<Maybe<string>>(null)
  const isAuthenticated = computed(() => !!accessToken.value)
  const isLoading       = ref(false)

  // localStorage 키 상수화
  const AUTH_STORAGE_KEY = 'auth-store'

  // localStorage 저장 헬퍼 함수
  const saveToStorage = (data: any) => {
    if (process.client) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
        console.log('Auth data saved to localStorage')
      } catch (error) {
        console.error('Failed to save auth data:', error)
      }
    }
  }

  // localStorage 불러오기 헬퍼 함수
  const loadFromStorage = () => {
    if (!process.client) return null
    
    try {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
      if (savedAuth) {
        const data = JSON.parse(savedAuth)
        console.log('Auth data loaded from localStorage:', data)
        return data
      }
    } catch (error) {
      console.error('Failed to load auth data:', error)
      // 손상된 데이터 제거
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
    return null
  }

  const socialSignIn = (response: ApiResponse<LoginUser>) => {
    if (response.success && response.data) {
      const loginData = response.data
      
      // 토큰과 사용자 정보 저장
      accessToken.value = loginData.token.accessToken
      refreshToken.value = loginData.token.refreshToken
      authUser.value = loginData

      // localStorage에 저장
      saveToStorage({
        user: loginData,
        accessToken: loginData.token.accessToken,
        refreshToken: loginData.token.refreshToken
      })

      navigateTo('/')
    }
  }

  const signIn = async (userId: string, password: string) => {
    isLoading.value = true
    
    try {
      const response = await $fetch<ApiResponse<LoginUser>>('/api/v1/auth/login', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: {
          userId,
          password,
        },
      })

      if (response.success && response.data) {
        const loginData = response.data
        
        // 토큰과 사용자 정보 저장
        accessToken.value = loginData.token.accessToken
        refreshToken.value = loginData.token.refreshToken
        authUser.value = loginData

        // localStorage에 저장
        saveToStorage({
          user: loginData,
          accessToken: loginData.token.accessToken,
          refreshToken: loginData.token.refreshToken
        })

        await navigateTo('/')
      } else {
        throw new Error(response.error || '로그인에 실패했습니다.')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      
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
  }

  const signOut = async (): Promise<void> => {
    authUser.value = null
    accessToken.value = null
    refreshToken.value = null
    
    if (process.client) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      console.log('Auth data cleared from localStorage')
    }
    
    await navigateTo('/login')
  }

  const initializeAuth = (): void => {
    if (!process.client) return

    console.log('Initializing auth from localStorage...')
    const savedData = loadFromStorage()
    
    if (savedData && savedData.accessToken) {
      authUser.value = savedData.user
      accessToken.value = savedData.accessToken
      refreshToken.value = savedData.refreshToken
      console.log('Auth state restored from localStorage')
    } else {
      console.log('No valid auth data found in localStorage')
    }
  }

  const refreshAccessToken = async (): Promise<boolean> => {
    if (!refreshToken.value) return false
    
    try {
      const response = await $fetch<ApiResponse<{ accessToken: string }>>('/auth/refresh', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: {
          refreshToken: refreshToken.value
        }
      })

      if (response.success && response.data) {
        accessToken.value = response.data.accessToken
        
        // localStorage 업데이트
        const savedData = loadFromStorage()
        if (savedData) {
          savedData.accessToken = response.data.accessToken
          saveToStorage(savedData)
        }
        
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
        return await refreshAccessToken()
      }
    } catch (error: any) {
      console.error('Auth check failed:', error)
      
      if (error.response?.status === 401) {
        return await refreshAccessToken()
      }
      
      // await signOut()
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
    isLoading
  }
})