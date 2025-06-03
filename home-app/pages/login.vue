<template>
    <div class="flex justify-center items-center py-12">
        <Card class="w-full max-w-md shadow-lg">
            <template #title>
                <h1 class="text-2xl font-bold text-center text-gray-800 mb-2">로그인</h1>
                <p class="text-center text-gray-600 mb-4">계정에 로그인하세요</p>
            </template>
            <template #content>
                <div class="mb-6">
                    <div class="grid grid-cols-1 gap-3">
                        <Button class="w-full flex justify-center items-center" severity="warning" @click="kakaoLogin" :loading="isLoading">
                            <i class="pi pi-comment mr-2"></i> 카카오로 로그인
                        </Button>
                    </div>
                </div>

                <Divider align="center">
                    <span class="text-gray-500">또는 아이디로 로그인</span>
                </Divider>

                <Form v-slot="$form" 
                    :resolver="resolver"
                    :initialValues="initialValues" 
                    @submit="onFormSubmit" 
                    class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1">
                        <label for="id" class="text-sm font-medium text-gray-700">아이디</label>
                        <InputText name="id" type="text" placeholder="아이디를 입력하세요" class="w-full p-inputtext-sm" />
                        <Message v-if="$form.id?.invalid" severity="error" size="small" variant="simple">{{ $form.id.error?.message }}</Message>
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="password" class="text-sm font-medium text-gray-700">비밀번호</label>
                        <InputText name="password" type="password" placeholder="비밀번호를 입력하세요" class="w-full p-inputtext-sm" />
                        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{ $form.password.error?.message }}</Message>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <Checkbox id="remember-me" name="remember-me" v-model="rememberMe" />
                            <label for="remember-me" class="ml-2 text-sm text-gray-600">로그인 상태 유지</label>
                        </div>
                        <div>
                            <a href="#" class="text-sm text-blue-600 hover:text-blue-800">비밀번호 찾기</a>
                        </div>
                    </div>
                    <Button type="submit" label="로그인" class="w-full" />
                    <div class="text-center mt-4">
                        <p class="text-sm text-gray-600">
                            계정이 없으신가요? 
                            <NuxtLink to="/register" class="text-blue-600 hover:text-blue-800 font-medium">회원가입</NuxtLink>
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

const toast = useToast();
const initialValues = ref({
    id: '',
    password: ''
});

const config = useRuntimeConfig();
const rememberMe = ref(false);
const isLoading = ref(false);
const { loginWithKakao } = useSocialLogin();

const { signIn } = useAuthStore();



const resolver = ref(zodResolver(
    z.object({
        id: z.string().min(1, { message: '아이디를 입력해주세요.' }),
        password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
    })
));




const onFormSubmit = async ({ values, valid }) => {
    if (valid) {
        try {
            await signIn(values.id, values.password);
            // 성공 시 store에서 자동으로 리다이렉트됨
            toast.add({ severity: 'success', summary: '로그인에 성공하였습니다.', life: 3000 });

            await navigateTo('/'); // 문자열로 경로 전달
        } catch (error) {
            toast.add({ severity: 'warn', summary: '로그인에 실패하였습니다.', life: 3000 });
        }
    }
};


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
</script>

<style lang="scss" scoped>

</style>