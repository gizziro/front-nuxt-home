<template>
  <NuxtLayout>
    <Toast />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

// 앱 시작 시 인증 정보 초기화
const authStore = useAuthStore()

// SSR과 CSR 모두에서 실행되도록 수정
onMounted(async () => {
  if (process.client) {
    console.log('Initializing auth...')
    await authStore.initializeAuth()
    // 인증 상태 확인
    const isAuth = await authStore.checkAuth()
    console.log('Auth status:', isAuth)
  }
})
</script>
