import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const logger = useLogger()
  const supabase = useSupabaseClient()
  const router = useRouter()

  const isAuthInitialized = ref(false)
  const isLoggedIn = ref(false)
  const user = reactive({
    id: '',
    email: '',
    name: '',
  })

  supabase.auth.onAuthStateChange((_event, session) => {
    user.id = session?.user?.id || ''
    user.email = session?.user?.email || ''
    user.name = session?.user?.user_metadata?.display_name || ''

    isLoggedIn.value = !!session?.user

    logger.debug('Auth state changed', {
      user,
      isLoggedIn: isLoggedIn.value,
      isAuthInitialized: isAuthInitialized.value,
    })
  })

  /**
   * Fetch the current user from Supabase and update the store state.
   */
  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser()

    user.id = data?.user?.id || ''
    user.email = data?.user?.email || ''
    user.name = data?.user?.user_metadata?.display_name || ''

    isLoggedIn.value = !!data.user
    isAuthInitialized.value = true

    logger.debug('Fetched user', {
      user,
      isLoggedIn: isLoggedIn.value,
      isAuthInitialized: isAuthInitialized.value,
    })
  }

  /**
   * Log out of Supabase and optionally replace the path.
   */
  const onLogout = async (to: string = '/login') => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    logger.info('Logout successful')
    router.replace(to)
  }

  fetchUser() // Call on store init

  return { user, isLoggedIn, isAuthInitialized, fetchUser, onLogout }
})
