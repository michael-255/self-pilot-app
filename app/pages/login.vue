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

const fields = [
  {
    name: 'email',
    type: 'text' as const,
    label: 'Email',
    placeholder: 'Enter your email',
    default: userEmail.value,
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password' as const,
    placeholder: 'Enter your password',
  },
]

const authSchema = z.object({
  email: z.email('Invalid email'),
  password: z
    .string()
    .min(8, 'Must be at least 8 characters')
    .default('')
    .refine(val => val, { message: 'Password is required' })
    .optional(),
})

type AuthSchema = z.output<typeof authSchema>

async function onSubmit(payload: FormSubmitEvent<AuthSchema>) {
  try {
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: payload.data.email,
      password: payload.data.password!,
    })

    if (loginError) throw new Error(loginError.message)

    userEmail.value = payload.data.email

    logger.debug('Login successful', { email: payload.data.email })
    await router.replace('/')
  } catch (e) {
    logger.error('Login error', e)
  } finally {
    loading.finish()
  }
}
</script>

<template>
  <UAuthForm
    :fields="fields"
    :schema="authSchema"
    title="Welcome back"
    icon="i-lucide-user"
    :loading="loading.isLoading.value"
    :submit="{
      color: 'primary',
      variant: 'solid',
    }"
    @submit="onSubmit"
  />
</template>
