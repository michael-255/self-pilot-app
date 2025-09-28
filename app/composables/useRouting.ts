/**
 * Coposable for routing related utilities.
 */
export default function useRouting() {
  // Do NOT return route or router from any composable due to performance issues
  const route = useRoute()
  const router = useRouter()
  const logger = useLogger()

  /**
   * Go back if previous route state is part of the app history, otherwise go to root path.
   */
  const goBack = () => {
    logger.debug('Routing: goBack', { historyState: router?.options?.history?.state })

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

    logger.debug('Routing: goToPath', { to, redirect })

    if (redirect && redirect !== to) {
      router.push({ path: to, query: { redirect } })
      return
    }
    router.push(to)
  }

  return { goBack, goToWithRedirect }
}
