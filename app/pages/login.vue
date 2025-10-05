<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'
import type { Database } from '~/types/supabase'

definePageMeta({
  layout: 'auth',
})

useSeoMeta({
  title: 'Login',
  description: 'Login to your account to continue',
})

const route = useRoute()
const router = useRouter()
const logger = useLogger()
const supabase = useSupabaseClient<Database>()
const authStore = useAuthStore()
const loading = useLoadingIndicator()
const userEmail = useLocalStorage<string>('selfpilot-user-email', '')
const message = getInspirationalMessage()
const showPassword = ref(false)
const errorMessage = ref('')

const state = reactive({
  email: userEmail.value, // Using by value so it doesn't update until form is submitted
  password: '',
})

const schema = z.object({
  email: z.email('Invalid email'),
  password: z
    .string()
    .min(8, 'Must be at least 8 characters')
    .default('')
    .refine((val) => val, { message: 'Password is required' })
    .optional(),
})

onMounted(() => {
  if (authStore.isLoggedIn) {
    router.replace('/')
  }
})

const onSubmit = async (payload: FormSubmitEvent<z.output<typeof schema>>) => {
  loading.start({ force: true })
  errorMessage.value = ''

  const { error } = await supabase.auth.signInWithPassword({
    email: payload.data.email,
    password: payload.data.password!,
  })

  if (error) {
    logger.error('Sign in failed', error)

    if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Sign in failed. Please try again.'
    }

    state.password = ''
    loading.finish({ force: true })
    return
  }

  userEmail.value = payload.data.email

  const redirectPath = Array.isArray(route.query.redirect)
    ? route.query.redirect[0]
    : route.query.redirect

  logger.info('Sign in successful', { email: payload.data.email })
  await router.replace(redirectPath || '/')
  loading.finish({ force: true })
}
</script>

<template>
  <UForm :schema :state class="space-y-6" @submit="onSubmit">
    <div class="flex flex-col items-center space-y-3">
      <UIcon name="i-lucide-user" class="w-9 h-9" />
      <div class="text-2xl font-bold">Welcome</div>
      <div class="text-gray-400 text-center">{{ message }}</div>
    </div>

    <USeparator />

    <UFormField label="Email" name="email">
      <UInput v-model="state.email" class="w-full" :disabled="loading.isLoading.value" />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput
        v-model="state.password"
        :type="showPassword ? 'text' : 'password'"
        class="w-full"
        :disabled="loading.isLoading.value"
      >
        <template #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            aria-label="show or hide password"
            @click="showPassword = !showPassword"
          />
        </template>
      </UInput>
    </UFormField>

    <div v-if="errorMessage" class="text-error text-sm text-center">
      {{ errorMessage }}
    </div>

    <UButton
      label="Continue"
      type="submit"
      class="w-full justify-center"
      color="primary"
      variant="solid"
      :disabled="loading.isLoading.value"
    />
  </UForm>
</template>
