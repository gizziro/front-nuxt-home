<template>
  <div>
    마이페이지
  </div>
</template>

<script setup>
const { authUser, isAuthenticated } = useAuthUser();

definePageMeta({
  middleware: 'auth-check',
})

</script>