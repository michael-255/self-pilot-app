/**
 * Coposable for routing related utilities.
 */
export default function useRouting() {
  // Do NOT return route or router from any composable due to performance issues
  const route = useRoute()
  const router = useRouter()
  const logger = useLogger()

  /**
   * Current route ID parameter, or empty string if not present.
   */
  const routeId = Array.isArray(route.params.id)
    ? (route.params.id[0] ?? '')
    : (route.params.id ?? '')

  /**
   * Go back if previous route state is part of the app history, otherwise go to root path.
   */
  const goBack = () => {
    logger.debug('Route back', { historyState: router?.options?.history?.state })

    if (router?.options?.history?.state?.back) {
      router.back()
    } else {
      router.push('/')
    }
  }

  /**
   * Navigate to a path with a saved redirect query parameter.
   */
  const goToWithRedirect = (to: string) => {
    const redirect = route.path

    logger.debug('Route with redirect', { to, redirect })

    if (redirect && redirect !== to) {
      router.push({ path: to, query: { redirect } })
      return
    }
    router.push(to)
  }

  return { routeId, goBack, goToWithRedirect }
}
