"// īī�� �α��� �ݹ� ������" 

<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 text-center">
    <Card class="w-full max-w-md shadow-lg">
      <template #title>
        <h1 class="text-2xl font-bold text-center text-gray-800">카카오 로그인 처리 중</h1>
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
        <div v-else-if="isNewUser" class="py-6">
          <!-- 새 사용자인 경우 추가 정보 입력 폼 표시 -->
          <div class="flex justify-center mb-4">
            <i class="pi pi-user-plus text-5xl text-blue-500"></i>
          </div>
          <h2 class="text-xl font-bold text-blue-600 mb-2">추가 정보 필요</h2>
          <p class="text-gray-700 mb-4">카카오 계정으로 회원가입을 완료하려면 추가 정보가 필요합니다.</p>
          <Button label="추가 정보 입력" @click="goToAdditionalInfo" class="w-full" />
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
const isNewUser = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const userData = ref(null);

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
    // 1. 서버에 인증 코드를 보내 액세스 토큰 받기
    const tokenResponse = await $fetch(`https://kauth.kakao.com/oauth/token`, {
      method: 'POST',
      body: {
        code,
        provider: 'KAKAO',
        redirect_uri: `${window.location.origin}/oauth/callback`
      }
    });

    if (!tokenResponse.success || !tokenResponse.data?.accessToken) {
      throw new Error('액세스 토큰을 받지 못했습니다.');
    }

    const accessToken = tokenResponse.data.accessToken;

    // 2. 액세스 토큰으로 사용자 정보 조회
    const userInfoResponse = await $fetch(`${config.public.apiBase}/api/v1/oauth2/user-info`, {
      method: 'POST',
      body: {
        provider: 'KAKAO',
        access_token: accessToken
      }
    });

    if (!userInfoResponse.success) {
      throw new Error('사용자 정보를 가져오지 못했습니다.');
    }

    // 사용자 정보 저장
    userData.value = userInfoResponse.data;

    // 3. 기존 사용자인지 확인 (providerId로 확인)
    const checkUserResponse = await $fetch(`${config.public.apiBase}/api/v1/auth/check-social-user`, {
      method: 'POST',
      body: {
        provider: 'KAKAO',
        providerId: userData.value.id
      }
    });

    if (checkUserResponse.success) {
      if (checkUserResponse.data.exists) {
        // 기존 사용자면 로그인 처리
        const loginResponse = await $fetch(`${config.public.apiBase}/api/v1/auth/social-login`, {
          method: 'POST',
          body: {
            provider: 'KAKAO',
            providerId: userData.value.id,
            device: {
              deviceId: Math.random().toString(36).substring(2, 15),
              deviceType: 'WEB',
              deviceName: navigator?.userAgent || 'Unknown'
            }
          }
        });

        if (loginResponse.success && loginResponse.data?.accessToken) {
          // 토큰 저장
          localStorage.setItem('access_token', loginResponse.data.accessToken);
          if (loginResponse.data.refreshToken) {
            localStorage.setItem('refresh_token', loginResponse.data.refreshToken);
          }

          // 로그인 성공
          success.value = true;
          successMessage.value = '카카오 계정으로 로그인이 완료되었습니다.';
          
          // 3초 후 홈으로 리다이렉트
          setTimeout(() => {
            navigateTo('/');
          }, 3000);
        } else {
          throw new Error('로그인 처리에 실패했습니다.');
        }
      } else {
        // 신규 사용자면 추가 정보 입력 페이지로 이동 준비
        isNewUser.value = true;
        
        // 카카오에서 받은 사용자 정보를 세션 스토리지에 저장 (추가 정보 페이지에서 사용)
        sessionStorage.setItem('kakao_user_data', JSON.stringify(userData.value));
      }
    } else {
      throw new Error('사용자 확인에 실패했습니다.');
    }
  } catch (err) {
    console.error('카카오 로그인 콜백 처리 오류:', err);
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
const goToAdditionalInfo = () => navigateTo('/oauth/additional-info');
</script> 
