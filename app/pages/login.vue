<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

definePageMeta({
  layout: 'auth',
  requiresAuth: false,
})

useSeoMeta({
  title: 'Login',
  description: 'Login to your account to continue',
})

const route = useRoute()
const router = useRouter()
const logger = useLogger()
const supabase = useSupabaseClient()
const authStore = useAuthStore()
const loading = useLoadingIndicator()
const userEmail = useLocalStorage('user-email', '')
const randomMessage =
  inspirationalMessages[Math.floor(Math.random() * inspirationalMessages.length)]
const showPassword = ref(false)
const form = reactive({
  email: userEmail.value,
  password: '',
})
const errorMessage = ref('')

const authSchema = z.object({
  email: z.email('Invalid email'),
  password: z
    .string()
    .min(8, 'Must be at least 8 characters')
    .default('')
    .refine((val) => val, { message: 'Password is required' })
    .optional(),
})

type AuthSchema = z.output<typeof authSchema>

const onSubmit = async (payload: FormSubmitEvent<AuthSchema>) => {
  try {
    loading.start({ force: true })
    errorMessage.value = ''

    const { error } = await supabase.auth.signInWithPassword({
      email: payload.data.email,
      password: payload.data.password!,
    })

    if (error) throw error

    userEmail.value = payload.data.email

    const redirectPath = Array.isArray(route.query.redirect)
      ? route.query.redirect[0]
      : route.query.redirect

    logger.info('Sign in successful', { email: payload.data.email })
    await router.replace(redirectPath || '/')
  } catch (e) {
    logger.error('Sign in failed', e)

    if (e instanceof Error) {
      errorMessage.value = e.message
    } else {
      errorMessage.value = 'Sign in failed. Please try again.'
    }

    form.password = ''
  } finally {
    loading.finish({ force: true })
  }
}
</script>

<template>
  <UForm :schema="authSchema" :state="form" class="space-y-6" @submit="onSubmit">
    <div class="flex flex-col items-center space-y-3">
      <UIcon name="i-lucide-user" class="w-9 h-9" />

      <div class="text-2xl font-bold">
        Welcome back
        <template v-if="authStore.isLoggedIn && !loading.isLoading.value">
          {{ ' ' + authStore.user.name }}
        </template>
      </div>

      <div
        v-if="!authStore.isLoggedIn || loading.isLoading.value"
        class="text-gray-400 text-center"
      >
        {{ randomMessage }}
      </div>

      <div v-else class="text-gray-400 text-center">
        You're already signed in.
        <a href="#" class="text-primary" @click.prevent="authStore.onLogout()"> Logout? </a>
      </div>
    </div>

    <USeparator />

    <UFormField label="Email" name="email">
      <UInput v-model="form.email" class="w-full" :disabled="loading.isLoading.value" />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput
        v-model="form.password"
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
      type="submit"
      class="w-full justify-center text-white"
      color="primary"
      variant="solid"
      :loading="loading.isLoading.value"
    >
      Continue
    </UButton>
  </UForm>
</template>
