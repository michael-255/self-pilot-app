import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const logger = useLogger()
  const supabase = useSupabaseClient()
  const loading = useLoadingIndicator()
  const router = useRouter()

  const isLoggedIn = ref(false)
  const user = reactive({
    id: '',
    email: '',
    name: '',
  })

  const onLogout = async (to: string = '/') => {
    try {
      loading.start()
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      logger.info('Logout successful')
      await router.replace(to)
    } catch (e) {
      logger.error('Logout failed', e)
    } finally {
      loading.finish()
    }
  }

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser()

    user.id = data?.user?.id || ''
    user.email = data?.user?.email || ''
    user.name = data?.user?.user_metadata?.display_name || ''

    isLoggedIn.value = !!data.user
    logger.debug('Fetched user', { user, isLoggedIn: isLoggedIn.value })
  }

  supabase.auth.onAuthStateChange((_event, session) => {
    user.id = session?.user?.id || ''
    user.email = session?.user?.email || ''
    user.name = session?.user?.user_metadata?.display_name || ''

    isLoggedIn.value = !!session?.user
    logger.debug('Auth state changed', { user, isLoggedIn: isLoggedIn.value })
  })

  fetchUser() // Call on store init

  return { user, isLoggedIn, fetchUser, onLogout }
})
