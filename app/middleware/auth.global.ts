export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  // Wait for auth state to be ready
  if (!authStore.isAuthReady) {
    await authStore.fetchUser()
  }

  // If user is logged in and tries to access /login, redirect to home
  if (authStore.isLoggedIn && to.path === '/login') {
    return navigateTo('/')
  }

  // If user is not logged in and tries to access a protected route (not /login)
  if (!authStore.isLoggedIn && to.path !== '/login') {
    // Setup a redirect query parameter to return after login
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }

  // Otherwise, allow navigation
})
