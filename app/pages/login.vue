<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

definePageMeta({
  layout: 'auth',
})

useSeoMeta({
  title: 'Login',
  description: 'Login to your account to continue',
})

const router = useRouter()
const logger = useLogger()
const supabase = useSupabaseClient()
const loading = useLoadingIndicator()
const userEmail = useLocalStorage('user-email', '')
const randomMessage =
  inspirationalMessages[Math.floor(Math.random() * inspirationalMessages.length)]
const showPassword = ref(false)
const state = reactive({
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

async function onSubmit(payload: FormSubmitEvent<AuthSchema>) {
  try {
    errorMessage.value = ''
    loading.start()

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: payload.data.email,
      password: payload.data.password!,
    })

    if (loginError) throw new Error(loginError.message)

    userEmail.value = payload.data.email

    logger.debug('Login successful', { email: payload.data.email })
    await router.replace('/')
  } catch (e) {
    logger.error('Login failed', e)

    if (e instanceof Error) {
      errorMessage.value = e.message
    } else {
      errorMessage.value = 'Login failed. Please try again.'
    }

    state.password = ''
  } finally {
    loading.finish()
  }
}
</script>

<template>
  <UForm :schema="authSchema" :state="state" class="space-y-6" @submit="onSubmit">
    <div class="flex flex-col items-center space-y-3">
      <UIcon name="i-lucide-user" class="w-9 h-9" />

      <div class="text-2xl font-bold">Welcome back</div>

      <div class="text-gray-400 text-center">
        {{ randomMessage }}
      </div>
    </div>

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
      type="submit"
      class="w-full justify-center text-white"
      color="primary"
      variant="solid"
      :loading="loading.isLoading.value"
      @submit.prevent="onSubmit"
    >
      Login
    </UButton>
  </UForm>
</template>
