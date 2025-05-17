<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 text-center">
    <Card class="w-full max-w-md shadow-lg">
      <template #title>
        <h1 class="text-2xl font-bold text-center text-gray-800">소셜 로그인 처리 중</h1>
      </template>
      <template #content>
        <div v-if="loading" class="flex flex-col items-center py-8">
          <ProgressSpinner style="width:50px;height:50px" strokeWidth="4" />
          <p class="mt-4 text-lg text-gray-600">로그인 정보를 확인하고 있습니다...</p>
        </div>
        <div v-else-if="error" class="py-6">
          <div class="flex justify-center mb-4">
            <i class="pi pi-exclamation-triangle text-5xl text-red-500"></i>
          </div>
          <h2 class="text-xl font-bold text-red-600 mb-2">로그인 오류</h2>
          <p class="text-gray-700 mb-4">{{ errorMessage }}</p>
          <div class="flex justify-center">
            <Button label="회원가입으로 돌아가기" @click="goToRegister" class="mr-2" />
            <Button label="로그인 페이지로 이동" @click="goToLogin" severity="secondary" />
          </div>
        </div>
        <div v-else-if="success" class="py-6">
          <div class="flex justify-center mb-4">
            <i class="pi pi-check-circle text-5xl text-green-500"></i>
          </div>
          <h2 class="text-xl font-bold text-green-600 mb-2">로그인 성공!</h2>
          <p class="text-gray-700 mb-4">{{ successMessage }}</p>
          <div class="flex justify-center">
            <Button label="홈으로 이동" @click="goToHome" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['guest-only'],
});

import { useToast } from "primevue/usetoast";

const route = useRoute();
const config = useRuntimeConfig();
const toast = useToast();

const loading = ref(true);
const error = ref(false);
const success = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// URL에서 파라미터 가져오기
const code = route.query.code;
const state = route.query.state;
const error_query = route.query.error;

onMounted(async () => {
  // 에러 파라미터 확인
  if (error_query) {
    loading.value = false;
    error.value = true;
    errorMessage.value = error_query === 'access_denied' 
      ? '사용자에 의해 로그인이 취소되었습니다.' 
      : '소셜 로그인 중 오류가 발생했습니다.';
    return;
  }

  // 필수 파라미터 확인
  if (!code || !state) {
    loading.value = false;
    error.value = true;
    errorMessage.value = '유효하지 않은 소셜 로그인 요청입니다.';
    return;
  }

  // 저장된 state 값과 비교 (CSRF 공격 방지)
  const savedState = localStorage.getItem('oauth_state');
  if (!savedState || savedState !== state) {
    loading.value = false;
    error.value = true;
    errorMessage.value = '보안 검증에 실패했습니다. 다시 시도해 주세요.';
    return;
  }

  // state 값 제거
  localStorage.removeItem('oauth_state');

  try {
    // 서버에 인증 코드 전송하여 토큰 받기
    const response = await $fetch(`${config.public.apiBase}/api/v1/oauth2/callback`, {
      method: 'POST',
      body: {
        code,
        state,
        redirect_uri: `${window.location.origin}/oauth/callback`
      }
    });

    // 응답 처리
    if (response.success) {
      // 로그인 성공 처리
      success.value = true;
      successMessage.value = '소셜 로그인이 완료되었습니다.';
      
      // 토큰 저장 (예: localStorage 또는 쿠키)
      if (response.data?.accessToken) {
        localStorage.setItem('access_token', response.data.accessToken);
        
        if (response.data.refreshToken) {
          localStorage.setItem('refresh_token', response.data.refreshToken);
        }
      }
      
      // 3초 후 홈으로 리다이렉트
      setTimeout(() => {
        navigateTo('/');
      }, 3000);
    } else {
      throw new Error(response.message || '인증 처리에 실패했습니다.');
    }
  } catch (err) {
    console.error('OAuth 콜백 처리 오류:', err);
    error.value = true;
    errorMessage.value = err.message || '로그인 처리 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
});

// 페이지 이동 함수
const goToHome = () => navigateTo('/');
const goToLogin = () => navigateTo('/login');
const goToRegister = () => navigateTo('/register');
</script> 