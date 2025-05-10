export default defineNuxtRouteMiddleware(() => {
  const { authUser, isAdmin, isAuthenticated } = useAuthUser();

  console.log('isAuthenticated', isAuthenticated.value);
  console.log('isAdmin', isAdmin.value);
  console.log('authUser', authUser.value);

  if (!isAuthenticated.value) {
    return navigateTo('/login');
  }

});