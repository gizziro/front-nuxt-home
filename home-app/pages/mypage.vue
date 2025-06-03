<template>
  <div>
    <section class="bg-blue-50 py-6 mb-8 rounded-lg">
      <div class="flex items-center justify-between px-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">마이페이지</h1>
          <p class="text-gray-600">회원 정보와 설정을 관리하세요.</p>
        </div>
        <Button label="로그아웃" severity="secondary" icon="pi pi-sign-out" />
      </div>
    </section>

    <TabView>
      <TabPanel header="회원 정보">
        <div class="p-4">
          <Card>
            <template #content>
              <div class="flex flex-col md:flex-row gap-8">
                <div class="flex-none">
                  <div class="bg-gray-200 rounded-full h-32 w-32 flex items-center justify-center text-4xl text-gray-400">
                    <i class="pi pi-user"></i>
                  </div>
                  <Button label="프로필 변경" text class="mt-4" />
                </div>
                <div class="flex-grow">
                  <h2 class="text-xl font-semibold mb-4">기본 정보</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p class="text-gray-500 text-sm">이름</p>
                      <p class="font-medium">홍길동</p>
                    </div>
                    <div>
                      <p class="text-gray-500 text-sm">아이디</p>
                      <p class="font-medium">honggildong</p>
                    </div>
                    <div>
                      <p class="text-gray-500 text-sm">이메일</p>
                      <p class="font-medium">hong@example.com</p>
                    </div>
                    <div>
                      <p class="text-gray-500 text-sm">가입일</p>
                      <p class="font-medium">2024년 11월 1일</p>
                    </div>
                  </div>
                  <Divider />
                  <div class="flex justify-end">
                    <Button label="정보 수정" icon="pi pi-pencil" />
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </TabPanel>

      <TabPanel header="알림 설정">
        <div class="p-4">
          <Card>
            <template #content>
              <h3 class="text-lg font-semibold mb-4">알림 설정</h3>
              <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium">이메일 알림</p>
                    <p class="text-sm text-gray-500">중요 업데이트 및 알림을 이메일로 받습니다</p>
                  </div>
                  <InputSwitch v-model="emailNotification" />
                </div>
                <Divider />
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium">푸시 알림</p>
                    <p class="text-sm text-gray-500">모바일 기기에 푸시 알림을 받습니다</p>
                  </div>
                  <InputSwitch v-model="pushNotification" />
                </div>
                <Divider />
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium">마케팅 수신 동의</p>
                    <p class="text-sm text-gray-500">프로모션 및 마케팅 정보를 수신합니다</p>
                  </div>
                  <InputSwitch v-model="marketingConsent" />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </TabPanel>

      <TabPanel header="보안">
        <div class="p-4">
          <Card>
            <template #content>
              <h3 class="text-lg font-semibold mb-4">비밀번호 변경</h3>
              <div class="flex flex-col gap-4 max-w-lg">
                <div>
                  <label for="current-password" class="block text-sm font-medium text-gray-700 mb-1">현재 비밀번호</label>
                  <InputText id="current-password" type="password" class="w-full" />
                </div>
                <div>
                  <label for="new-password" class="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
                  <InputText id="new-password" type="password" class="w-full" />
                </div>
                <div>
                  <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
                  <InputText id="confirm-password" type="password" class="w-full" />
                </div>
                <div class="flex justify-end mt-4">
                  <Button label="비밀번호 변경" severity="success" />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </TabPanel>
    </TabView>
  </div>
</template>

<script setup>
definePageMeta({
 middleware: ['auth-check']
});

const emailNotification = ref(true);
const pushNotification = ref(false);
const marketingConsent = ref(false);
</script>