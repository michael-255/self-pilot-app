/**
 * Global authentication middleware
 * Auth required for all routes unless `requiresAuth` is explicitly set to false.
 */
export default defineNuxtRouteMiddleware((to) => {
  const logger = useLogger()
  const authStore = useAuthStore()

  if (to.meta.requiresAuth !== false && !authStore.isLoggedIn && authStore.isAuthInitialized) {
    logger.debug('Auth Required', { for: to.path })
    return navigateTo(`/login?redirect=${to.path}`)
  }
})
