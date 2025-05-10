  <template>
  <div class="container mx-auto"> 
    <h2>HI</h2>
    <ul class="flex gap-4">
      <li><NuxtLink to="/">홈</NuxtLink></li>
      <li><NuxtLink to="/login">로그인</NuxtLink></li>
      <li><NuxtLink to="/register">회원가입</NuxtLink></li>
      <li><NuxtLink to="/mypage">마이페이지</NuxtLink></li>
    </ul>
  </div>
  <div>
    <h2>로그인 상태</h2>
    <div v-if="isAuthenticated">
      <p>로그인 상태입니다.</p>
      <p>{{ authUser }}</p>
      <Button label="로그아웃" @click="signOut" />
    </div>
    <div v-else>
      <p>로그인 상태가 아닙니다.</p>
    </div>
  </div>
  <div>
    <slot />
  </div>
</template>

<script setup>
const { authUser, isAuthenticated } = useAuthUser();
const { signOut } = useAuth();

</script>