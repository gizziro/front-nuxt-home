<template>
  <div class="min-h-screen flex flex-col">
    <!-- 상단 네비게이션 바 -->
    <header class="bg-white shadow-md">
      <div class="container mx-auto px-4 py-3">
        <div class="flex justify-between items-center">
          <!-- 로고 및 메인 메뉴 -->
          <div class="flex items-center space-x-8">
            <NuxtLink to="/" class="text-2xl font-bold text-blue-600">홈로고</NuxtLink>
            <nav class="hidden md:flex space-x-6">
              <NuxtLink to="/" class="text-gray-600 hover:text-blue-600 transition-colors py-2">홈</NuxtLink>
              <NuxtLink to="/mypage" class="text-gray-600 hover:text-blue-600 transition-colors py-2">마이페이지</NuxtLink>
              <!-- 추가 메뉴 항목 -->
            </nav>
          </div>
          
          <!-- 로그인/회원가입 버튼 -->
          <div class="flex items-center space-x-3">
            <template v-if="isAuthenticated">
              <NuxtLink to="/mypage">
                <Button label="마이페이지" severity="secondary" size="small" />
              </NuxtLink>
              <Button label="로그아웃" severity="danger" size="small" @click="handleLogout" />
            </template>
            <template v-else>
              <NuxtLink to="/login">
                <Button label="로그인" class="p-button-outlined" size="small" />
              </NuxtLink>
              <NuxtLink to="/register">
                <Button label="회원가입" severity="info" size="small" />
              </NuxtLink>
            </template>
          </div>
        </div>
        
        <!-- 모바일 메뉴 토글 버튼 (추후 구현) -->
      </div>
    </header>

    <!-- 메인 콘텐츠 영역 -->
    <main class="flex-grow container mx-auto px-4 py-6">
      <slot />
    </main>

    <!-- 푸터 -->
    <footer class="bg-gray-100 py-6">
      <div class="container mx-auto px-4 text-center text-gray-600">
        <p>© 2024 홈 웹사이트. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// 필요한 API 상태 확인
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)


const config = useRuntimeConfig()
let data = null
let error = null


const handleLogout = async () => {
  try {
    await authStore.signOut();
    // 성공 시 store에서 자동으로 리다이렉트됨
    await navigateTo('/login');
  } catch (error) {
      toast.add({ severity: 'warn', summary: '로그인에 실패하였습니다.', life: 3000 });
  }
};

</script>