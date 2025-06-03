<template>
  <div class="flex justify-center items-center py-12">
    <Card class="w-full max-w-md shadow-lg">
      <template #title>
        <h1 class="text-2xl font-bold text-center text-gray-800 mb-2">추가 정보 입력</h1>
        <p class="text-center text-gray-600 mb-4">회원가입을 완료하기 위해 추가 정보를 입력해주세요</p>
      </template>
      <template #content>
        <Form v-slot="$form" 
              :resolver="resolver"
              :initialValues="formData" 
              @submit="onFormSubmit" 
              class="flex flex-col gap-4">
          
          <!-- 프로필 정보 표시 -->
          <div v-if="socialUserData" class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-2">
            <div v-if="socialUserData.profileImage" class="w-16 h-16 overflow-hidden rounded-full">
              <img :src="socialUserData.profileImage" alt="프로필 이미지" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-full">
              <i class="pi pi-user text-3xl text-gray-500"></i>
            </div>
            <div>
              <p class="font-medium text-lg">{{ socialUserData.name || '이름 없음' }}</p>
              <p class="text-gray-500 text-sm">{{ socialUserData.email || '이메일 없음' }}</p>
              <div class="mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs inline-block rounded">
                {{ getProviderName() }} 계정
              </div>
            </div>
          </div>

          <!-- 아이디 입력 필드 -->
          <div class="flex flex-col gap-1">
            <label for="userId" class="text-sm font-medium text-gray-700">아이디 <span class="text-red-500">*</span></label>
            <div class="flex gap-2">
              <InputText name="userId" type="text" placeholder="아이디 (영문, 숫자 4~20자)" class="w-full p-inputtext-sm" 
                v-model="formData.userId" @change="checkUserIdAvailable" />
              <Button type="button" @click="checkUserIdAvailable" icon="pi pi-check" class="p-button-outlined" />
            </div>
            
            <small v-if="userIdChecking" class="text-blue-500">아이디 확인 중...</small>
            <small v-else-if="userIdAvailable === true" class="text-green-500">사용 가능한 아이디입니다.</small>
            <small v-else-if="userIdAvailable === false" class="text-red-500">아이디를 사용 할 수 없습니다.</small>
            <small v-if="userIdError" class="text-red-500">{{ userIdError }}</small>
            
            <Message v-if="$form.userId?.invalid" severity="error" size="small" variant="simple">{{ $form.userId.error?.message }}</Message>
          </div>

          <!-- 이름 입력 필드 (소셜 계정에서 가져온 정보가 있다면 미리 채움) -->
          <div class="flex flex-col gap-1">
            <label for="name" class="text-sm font-medium text-gray-700">이름 <span class="text-red-500">*</span></label>
            <InputText name="name" type="text" placeholder="이름을 입력하세요" class="w-full p-inputtext-sm" v-model="formData.name" />
            <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{ $form.name.error?.message }}</Message>
          </div>

          <!-- 이메일 입력 필드 (소셜 계정에서 가져온 정보가 있다면 미리 채움) -->
          <div class="flex flex-col gap-1">
            <label for="email" class="text-sm font-medium text-gray-700">이메일 <span class="text-red-500">*</span></label>
            <div class="flex gap-2">
              <InputText name="email" type="email" placeholder="이메일을 입력하세요" class="w-full p-inputtext-sm" 
                v-model="formData.email" @change="checkEmailAvailable" />
              <Button type="button" @click="checkEmailAvailable" icon="pi pi-check" class="p-button-outlined" />
            </div>
            <small v-if="emailChecking" class="text-blue-500">이메일 확인 중...</small>
            <small v-else-if="emailAvailable === true" class="text-green-500">사용 가능한 이메일입니다.</small>
            <small v-else-if="emailAvailable === false" class="text-red-500">이미 사용 중인 이메일입니다.</small>
            <small v-if="emailError" class="text-red-500">{{ emailError }}</small>
            <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{ $form.email.error?.message }}</Message>
          </div>

          <!-- 전화번호 입력 필드 -->
          <div class="flex flex-col gap-1">
            <label for="phone" class="text-sm font-medium text-gray-700">전화번호 <span class="text-red-500">*</span></label>
            <div class="flex gap-2">
              <InputText name="phone" type="text" placeholder="'-' 없이 11자리 번호 입력" class="w-full p-inputtext-sm" 
                v-model="formData.phone" @change="checkPhoneAvailable" />
              <Button type="button" @click="checkPhoneAvailable" icon="pi pi-check" class="p-button-outlined" />
            </div>
            <small v-if="phoneChecking" class="text-blue-500">전화번호 확인 중...</small>
            <small v-else-if="phoneAvailable === true" class="text-green-500">사용 가능한 전화번호입니다.</small>
            <small v-else-if="phoneAvailable === false" class="text-red-500">이미 사용 중인 전화번호입니다.</small>
            <small v-if="phoneError" class="text-red-500">{{ phoneError }}</small>
            <Message v-if="$form.phone?.invalid" severity="error" size="small" variant="simple">{{ $form.phone.error?.message }}</Message>
          </div>

          <div class="flex items-center mt-2">
            <Checkbox id="terms" name="terms" v-model="agreeTerms" />
            <label for="terms" class="ml-2 text-sm text-gray-600">
              <span>이용약관과 개인정보 처리방침에 동의합니다.</span>
            </label>
          </div>

          <Button type="submit" label="회원가입 완료" class="w-full mt-4" :loading="isLoading" />
          
          <div class="text-center mt-4">
            <p class="text-sm text-gray-600">
              <Button link @click="cancelSignup" class="text-red-600 p-0">취소하고 돌아가기</Button>
            </p>
          </div>
        </Form>
      </template>
    </Card>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['guest-check'],
});

import { useToast } from "primevue/usetoast";
const config = useRuntimeConfig();
const toast = useToast();
const isLoading = ref(false);
const agreeTerms = ref(false);
const socialUserData = ref(null);
const socialProvider = ref('');
const socialProviderId = ref('');

// 아이디, 이메일, 전화번호 중복 체크 상태
const userIdChecking = ref(false);
const emailChecking = ref(false);
const phoneChecking = ref(false);
const userIdAvailable = ref(null);
const emailAvailable = ref(null);
const phoneAvailable = ref(null);
const userIdError = ref('');
const emailError = ref('');
const phoneError = ref('');

// 폼 데이터 초기화
const formData = ref({
  userId: '',
  name: '',
  email: '',
  phone: '',
  provider: '',
  providerId: '',
  device: {
    deviceId: '',
    deviceType: 'WEB',
    deviceName: navigator?.userAgent || 'Unknown'
  }
});

// 페이지 로드 시 세션 스토리지에서 소셜 로그인 정보 가져오기
onMounted(() => {
  // 카카오 사용자 데이터 확인
  const kakaoUserData = sessionStorage.getItem('kakao_user_data');
  if (kakaoUserData) {
    try {
      socialUserData.value = JSON.parse(kakaoUserData);
      socialProvider.value = 'KAKAO';
      socialProviderId.value = socialUserData.value.id;
      
      // 폼 데이터 초기화
      formData.value.name = socialUserData.value.name || '';
      formData.value.email = socialUserData.value.email || '';
      formData.value.provider = 'KAKAO';
      formData.value.providerId = socialUserData.value.id;
    } catch (error) {
      console.error('소셜 사용자 데이터 파싱 오류:', error);
    }
  } else {
    // 세션 데이터가 없으면 회원가입 페이지로 리다이렉트
    toast.add({ 
      severity: 'error', 
      summary: '잘못된 접근', 
      detail: '소셜 로그인을 통해 접근해주세요.', 
      life: 3000 
    });
    navigateTo('/register');
  }
});

// 소셜 제공자 이름 가져오기
const getProviderName = () => {
  switch (socialProvider.value) {
    case 'KAKAO': return '카카오';
    case 'NAVER': return '네이버';
    case 'GOOGLE': return '구글';
    case 'GITHUB': return '깃허브';
    default: return '소셜';
  }
};

// 유효성 검사 스키마
const resolver = ref(zodResolver(
  z.object({
    userId: z.string()
      .min(4, { message: '아이디는 4자 이상이어야 합니다.' })
      .max(20, { message: '아이디는 20자 이하여야 합니다.' })
      .regex(/^[a-zA-Z0-9]{4,20}$/, { message: '아이디는 영문자와 숫자만 사용할 수 있습니다.' }),
    name: z.string().min(1, { message: '이름을 입력해주세요.' }),
    email: z.string()
      .min(1, { message: '이메일을 입력해주세요.' })
      .email({ message: '올바른 이메일 형식이 아닙니다.' }),
    phone: z.string()
      .regex(/^\d{11}$/, { message: "전화번호는 '-' 없이 11자리 숫자로 입력해주세요." })
  })
));

// 아이디 중복 확인
const checkUserIdAvailable = async () => {
  if (!formData.value.userId || formData.value.userId.length < 4) return;
  
  userIdChecking.value = true;
  userIdAvailable.value = null;
  userIdError.value = '';
  
  try {
    const response = await $fetch(`${config.public.apiBase}/api/v1/auth/signup/check/userid`, {
      method: 'POST',
      body: {
        userId: formData.value.userId
      }
    });
    
    if (response.success) {
      userIdAvailable.value = response.data;
    } else {
      userIdAvailable.value = false;
      if (response.error) {
        userIdError.value = response.error.description || response.error.message || '';
        toast.add({ severity: 'error', summary: '아이디 중복 확인', detail: userIdError.value, life: 3000 });
      }
    }
  } catch (error) {
    console.error('아이디 중복 확인 오류:', error);
    userIdAvailable.value = false;
    userIdError.value = '아이디 중복 확인 중 오류가 발생했습니다.';
    toast.add({ severity: 'error', summary: '오류', detail: userIdError.value, life: 3000 });
  } finally {
    userIdChecking.value = false;
  }
};

// 이메일 중복 확인
const checkEmailAvailable = async () => {
  if (!formData.value.email || !formData.value.email.includes('@')) return;
  
  emailChecking.value = true;
  emailAvailable.value = null;
  emailError.value = '';
  
  try {
    const response = await $fetch(`${config.public.apiBase}/api/v1/auth/signup/check/email`, {
      method: 'POST',
      body: {
        email: formData.value.email
      }
    });
    
    if (response.success) {
      emailAvailable.value = response.data;
    } else {
      emailAvailable.value = false;
      if (response.error) {
        emailError.value = response.error.description || response.error.message || '';
        toast.add({ severity: 'error', summary: '이메일 중복 확인', detail: emailError.value, life: 3000 });
      }
    }
  } catch (error) {
    console.error('이메일 중복 확인 오류:', error);
    emailAvailable.value = false;
    emailError.value = '이메일 중복 확인 중 오류가 발생했습니다.';
    toast.add({ severity: 'error', summary: '오류', detail: emailError.value, life: 3000 });
  } finally {
    emailChecking.value = false;
  }
};

// 전화번호 중복 확인
const checkPhoneAvailable = async () => {
  if (!formData.value.phone || formData.value.phone.length !== 11) return;
  
  phoneChecking.value = true;
  phoneAvailable.value = null;
  phoneError.value = '';
  
  try {
    const response = await $fetch(`${config.public.apiBase}/api/v1/auth/signup/check/phone`, {
      method: 'POST',
      body: {
        phone: formData.value.phone
      }
    });
    
    if (response.success) {
      phoneAvailable.value = response.data;
    } else {
      phoneAvailable.value = false;
      if (response.error) {
        phoneError.value = response.error.description || response.error.message || '';
        toast.add({ severity: 'error', summary: '전화번호 중복 확인', detail: phoneError.value, life: 3000 });
      }
    }
  } catch (error) {
    console.error('전화번호 중복 확인 오류:', error);
    phoneAvailable.value = false;
    phoneError.value = '전화번호 중복 확인 중 오류가 발생했습니다.';
    toast.add({ severity: 'error', summary: '오류', detail: phoneError.value, life: 3000 });
  } finally {
    phoneChecking.value = false;
  }
};

// 폼 제출 처리
const onFormSubmit = async ({ values, valid }) => {
  // 약관 동의 확인
  if (!agreeTerms.value) {
    toast.add({ severity: 'error', summary: '약관 동의 필요', detail: '이용약관과 개인정보 처리방침에 동의해주세요.', life: 3000 });
    return;
  }
  
  // 아이디, 이메일, 전화번호 중복 확인이 완료되었는지 체크
  if (userIdAvailable.value === null) {
    await checkUserIdAvailable();
    if (!userIdAvailable.value) return;
  } else if (userIdAvailable.value === false) {
    toast.add({ severity: 'error', summary: '중복된 아이디', detail: '이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.', life: 3000 });
    return;
  }
  
  if (emailAvailable.value === null) {
    await checkEmailAvailable();
    if (!emailAvailable.value) return;
  } else if (emailAvailable.value === false) {
    toast.add({ severity: 'error', summary: '중복된 이메일', detail: '이미 사용 중인 이메일입니다. 다른 이메일을 입력해주세요.', life: 3000 });
    return;
  }
  
  if (phoneAvailable.value === null) {
    await checkPhoneAvailable();
    if (!phoneAvailable.value) return;
  } else if (phoneAvailable.value === false) {
    toast.add({ severity: 'error', summary: '중복된 전화번호', detail: '이미 사용 중인 전화번호입니다. 다른 전화번호를 입력해주세요.', life: 3000 });
    return;
  }
  
  if (valid) {
    isLoading.value = true;
    try {
      // device 정보 설정
      formData.value.device = {
        deviceId: Math.random().toString(36).substring(2, 15),
        deviceType: 'WEB',
        deviceName: navigator?.userAgent || 'Unknown'
      };
      
      // API 호출
      const response = await $fetch(`${config.public.apiBase}/api/v1/auth/social-signup`, {
        method: 'POST',
        body: {
          userId: formData.value.userId,
          name: formData.value.name,
          email: formData.value.email,
          phone: formData.value.phone,
          provider: formData.value.provider,
          providerId: formData.value.providerId,
          device: formData.value.device
        }
      });
      
      if (response.success) {
        // 세션 스토리지 정리
        sessionStorage.removeItem('kakao_user_data');
        
        // 회원가입 성공 및 자동 로그인
        if (response.data?.accessToken) {
          localStorage.setItem('access_token', response.data.accessToken);
          if (response.data.refreshToken) {
            localStorage.setItem('refresh_token', response.data.refreshToken);
          }
        }
        
        toast.add({ severity: 'success', summary: '회원가입 성공', detail: '소셜 계정으로 회원가입이 완료되었습니다.', life: 3000 });
        await navigateTo({ path: '/' });
      } else {
        throw new Error(response.error?.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('소셜 회원가입 오류:', error);
      toast.add({ 
        severity: 'error', 
        summary: '회원가입 실패', 
        detail: error.message || '회원가입 처리 중 오류가 발생했습니다.', 
        life: 5000 
      });
    } finally {
      isLoading.value = false;
    }
  }
};

// 회원가입 취소
const cancelSignup = () => {
  // 세션 스토리지 정리
  sessionStorage.removeItem('kakao_user_data');
  navigateTo('/login');
};
</script> 