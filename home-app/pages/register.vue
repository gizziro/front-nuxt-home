<template>
  <div>회원가입</div>
</template>


<script setup>

definePageMeta({
  middleware: ['guest-only'],
});

</script>