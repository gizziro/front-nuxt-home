<template>
    <div class="flex justify-center items-center py-8">
        <Card class="w-full max-w-lg shadow-lg">
            <template #title>
                <h1 class="text-2xl font-bold text-center text-gray-800 mb-2">회원가입</h1>
                <p class="text-center text-gray-600 mb-4">새 계정을 만들어보세요</p>
            </template>
            <template #content>
                <div class="mb-6">
                    <div class="grid grid-cols-1 gap-3">
                        <Button class="w-full flex justify-center items-center" severity="warning" @click="kakaoLogin" :loading="isLoading">
                            <i class="pi pi-comment mr-2"></i> 카카오로 시작하기
                        </Button>
                        <Button class="w-full flex justify-center items-center" severity="success" @click="naverLogin" :loading="isLoading">
                            <i class="pi pi-check-square mr-2"></i> 네이버로 시작하기
                        </Button>
                        <Button class="w-full flex justify-center items-center" @click="githubLogin" :loading="isLoading">
                            <i class="pi pi-github mr-2"></i> 깃허브로 시작하기
                        </Button>
                        <Button class="w-full flex justify-center items-center" severity="info" @click="googleLogin" :loading="isLoading">
                            <i class="pi pi-google mr-2"></i> 구글로 시작하기
                        </Button>
                    </div>
                </div>

                <Divider align="center">
                    <span class="text-gray-500">또는 직접 가입하기</span>
                </Divider>

                <Form v-slot="$form" 
                    :resolver="resolver"
                    :initialValues="formData" 
                    @submit="onFormSubmit" 
                    class="flex flex-col gap-4 mt-4">
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

                    <div class="flex flex-col gap-1">
                        <label for="name" class="text-sm font-medium text-gray-700">이름 <span class="text-red-500">*</span></label>
                        <InputText name="name" type="text" placeholder="이름을 입력하세요" class="w-full p-inputtext-sm" v-model="formData.name" />
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{ $form.name.error?.message }}</Message>
                    </div>

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

                    <div class="flex flex-col gap-1">
                        <label for="phone" class="text-sm font-medium text-gray-700">전화번호</label>
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

                    <div class="flex flex-col gap-1">
                        <label for="password" class="text-sm font-medium text-gray-700">비밀번호 <span class="text-red-500">*</span></label>
                        <InputText name="password" type="password" placeholder="영문, 숫자, 특수문자 포함 8자 이상" class="w-full p-inputtext-sm" v-model="formData.password" />
                        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{ $form.password.error?.message }}</Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label for="confirmPassword" class="text-sm font-medium text-gray-700">비밀번호 확인 <span class="text-red-500">*</span></label>
                        <InputText name="confirmPassword" type="password" placeholder="비밀번호를 다시 입력하세요" class="w-full p-inputtext-sm" v-model="formData.confirmPassword" />
                        <Message v-if="$form.confirmPassword?.invalid" severity="error" size="small" variant="simple">{{ $form.confirmPassword.error?.message }}</Message>
                    </div>

                    <div class="flex items-center mt-2">
                        <Checkbox id="terms" name="terms" v-model="agreeTerms" />
                        <label for="terms" class="ml-2 text-sm text-gray-600">
                            <span>이용약관과 개인정보 처리방침에 동의합니다.</span>
                        </label>
                    </div>

                    <Button type="submit" label="회원가입" class="w-full mt-4" :loading="isLoading" />
                    
                    <div class="text-center mt-4">
                        <p class="text-sm text-gray-600">
                            이미 계정이 있으신가요? 
                            <NuxtLink to="/login" class="text-blue-600 hover:text-blue-800 font-medium">로그인</NuxtLink>
                        </p>
                    </div>
                </Form>
            </template>
        </Card>
    </div>
</template>

<script setup>
definePageMeta({
  middleware: ['guest-only'],
});

import { useToast } from "primevue/usetoast";
import { useSocialLogin } from "#imports";

const config = useRuntimeConfig();
const toast = useToast();
const isLoading = ref(false);
const agreeTerms = ref(false);
const { loginWithKakao, loginWithNaver, loginWithGithub, loginWithGoogle } = useSocialLogin();

// 소셜 로그인 함수들
const kakaoLogin = () => {
    isLoading.value = true;
    try {
        loginWithKakao();
    } catch (error) {
        console.error('카카오 로그인 오류:', error);
        toast.add({ 
            severity: 'error', 
            summary: '로그인 오류', 
            detail: '카카오 로그인 중 오류가 발생했습니다.', 
            life: 3000 
        });
        isLoading.value = false;
    }
};

const naverLogin = () => {
    toast.add({ 
        severity: 'info', 
        summary: '준비 중', 
        detail: '네이버 로그인은 준비 중입니다.', 
        life: 3000 
    });
};

const githubLogin = () => {
    toast.add({ 
        severity: 'info', 
        summary: '준비 중', 
        detail: '깃허브 로그인은 준비 중입니다.', 
        life: 3000 
    });
};

const googleLogin = () => {
    toast.add({ 
        severity: 'info', 
        summary: '준비 중', 
        detail: '구글 로그인은 준비 중입니다.', 
        life: 3000 
    });
};

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

const formData = ref({
    userId: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    provider: 'LOCAL',
    providerId: '',
    device: {
        deviceId: '',
        deviceType: 'WEB',
        deviceName: navigator?.userAgent || 'Unknown'
    }
});

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
            .optional()
            .or(z.literal('')),
        password: z.string()
            .min(8, { message: '비밀번호는 8자 이상이어야 합니다.' })
            .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, 
                { message: '비밀번호는 영문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다.' }),
        confirmPassword: z.string().min(1, { message: '비밀번호 확인을 입력해주세요.' })
    }).refine((data) => data.password === data.confirmPassword, {
        message: "비밀번호가 일치하지 않습니다.",
        path: ["confirmPassword"],
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
    
    // 아이디, 이메일 중복 확인이 완료되었는지 체크
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
    
    if (formData.value.phone && phoneAvailable.value === null) {
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
            const response = await $fetch(`${config.public.apiBase}/api/v1/auth/signup`, {
                method: 'POST',
                body: {
                    userId: formData.value.userId,
                    name: formData.value.name,
                    email: formData.value.email,
                    phone: formData.value.phone || null,
                    password: formData.value.password,
                    provider: 'LOCAL',
                    providerId: null,
                    device: formData.value.device
                }
            });
            
            toast.add({ severity: 'success', summary: '회원가입 성공', detail: '회원가입에 성공하였습니다.', life: 3000 });
            await navigateTo({ path: '/login' });
        } catch (error) {
            console.error('회원가입 오류:', error);
            toast.add({ 
                severity: 'error', 
                summary: '회원가입 실패', 
                detail: error.response?.data?.message || '회원가입 처리 중 오류가 발생했습니다.', 
                life: 5000 
            });
        } finally {
            isLoading.value = false;
        }
    }
};
</script>