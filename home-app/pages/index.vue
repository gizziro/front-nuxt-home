<template>
  <div>
    <!-- 히어로 섹션 -->
    <section class="bg-blue-50 py-12 mb-8 rounded-lg">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">홈 웹사이트에 오신 것을 환영합니다</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">Nuxt와 PrimeVue로 구축된 모던 웹 애플리케이션입니다.</p>
        <div class="flex justify-center gap-4">
          <Button label="자세히 보기" icon="pi pi-arrow-right" iconPos="right" />
          <Button label="시작하기" severity="secondary" />
        </div>
      </div>
    </section>

    <!-- 콘텐츠 섹션 -->
    <section class="mb-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card class="shadow-md">
          <template #header>
            <div class="bg-blue-100 p-4 flex justify-center">
              <i class="pi pi-home text-4xl text-blue-600"></i>
            </div>
          </template>
          <template #title>홈 관리</template>
          <template #content>
            <p class="text-gray-600">홈 관리를 위한 다양한 기능을 제공합니다.</p>
          </template>
          <template #footer>
            <Button label="더 알아보기" link />
          </template>
        </Card>
        
        <Card class="shadow-md">
          <template #header>
            <div class="bg-green-100 p-4 flex justify-center">
              <i class="pi pi-users text-4xl text-green-600"></i>
            </div>
          </template>
          <template #title>커뮤니티</template>
          <template #content>
            <p class="text-gray-600">다른 사용자들과 소통하고 정보를 공유하세요.</p>
          </template>
          <template #footer>
            <Button label="더 알아보기" link />
          </template>
        </Card>
        
        <Card class="shadow-md">
          <template #header>
            <div class="bg-purple-100 p-4 flex justify-center">
              <i class="pi pi-cog text-4xl text-purple-600"></i>
            </div>
          </template>
          <template #title>설정</template>
          <template #content>
            <p class="text-gray-600">개인 설정을 통해 맞춤형 경험을 제공합니다.</p>
          </template>
          <template #footer>
            <Button label="더 알아보기" link />
          </template>
        </Card>
      </div>
    </section>
  </div>
</template>

<script setup>
// 필요한 경우 스크립트 로직을 여기에 추가하세요
</script>