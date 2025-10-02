<script setup lang="ts">
import { ref } from 'vue'
import { localDatabase } from '~/utils/local-database'

const open = ref(false)
const isDevMode = import.meta.env.DEV
const title = 'Settings'
const description = 'Manage your profile and application logs'

useSeoMeta({
  title,
  description,
})

const route = useRoute()
const router = useRouter()
const logger = useLogger()
const authStore = useAuthStore()
const logCounts = ref<{
  all: number
  debug: number
  info: number
  warn: number
  error: number
}>({
  all: 0,
  debug: 0,
  info: 0,
  warn: 0,
  error: 0,
})

const subscription = localDatabase
  .liveLogCounts()
  .subscribe(
    (counts: { all: number; debug: number; info: number; warn: number; error: number }) => {
      logCounts.value = counts
    },
  )

onUnmounted(() => {
  if (subscription) subscription.unsubscribe()
})

/**
 * Test function for the logger should only be available in dev mode.
 */
const onTestLogger = () => {
  const test = {
    user: {
      name: authStore.user.name || 'Anonymous',
      email: authStore.user.email || 'None',
    },
    timestamp: Date.now(),
    path: route.fullPath,
  }
  logger.debug('This is a debug message', test)
  logger.info('This is an info message', test)
  logger.warn('This is a warning message', test)
  logger.error('This is an error message', test)
}
</script>

<template>
  <UPage>
    <UContainer class="pb-16">
      <UPageHeader title="Settings" class="mb-9" />

      <UPageList class="space-y-9">
        <UPageFeature
          icon="i-lucide-user"
          title="Profile"
          description="User profile information when signed in."
          class="mb-4"
        />
        <div class="ml-8 space-y-4">
          <UUser
            :name="authStore.user.name"
            :description="authStore.user.email"
            :avatar="
              authStore.user.name
                ? { text: authStore.user.name.slice(0, 2) }
                : { icon: 'i-lucide-user' }
            "
            size="xl"
          />

          <UButton
            label="Logout"
            color="error"
            icon="i-lucide-log-out"
            @click="authStore.onLogout()"
          />
        </div>

        <UPageFeature
          title="Logs"
          icon="i-lucide-logs"
          description="View or delete client side application logs."
          class="mb-4"
        />
        <div class="ml-8 space-y-4">
          <div class="space-x-2">
            <UBadge :label="`All: ${logCounts.all}`" variant="outline" color="neutral" />
            <UBadge
              :label="`Debug: ${logCounts.debug}`"
              variant="outline"
              color="neutral"
              class="text-purple-400"
            />
            <UBadge
              :label="`Info: ${logCounts.info}`"
              variant="outline"
              color="neutral"
              class="text-blue-400"
            />
            <UBadge
              :label="`Warn: ${logCounts.warn}`"
              variant="outline"
              color="neutral"
              class="text-orange-400"
            />
            <UBadge
              :label="`Error: ${logCounts.error}`"
              variant="outline"
              color="neutral"
              class="text-red-400"
            />
          </div>

          <div>
            <UButton
              color="primary"
              icon="i-lucide-text-search"
              size="lg"
              label="View Logs"
              @click="router.push('/settings/logs')"
            />
          </div>

          <div>
            <UModal v-model:open="open" title="Delete Logs" :ui="{ footer: 'justify-end' }">
              <UButton color="error" icon="i-lucide-trash" size="lg" label="Delete Logs" />

              <template #body>
                Are you sure you want to delete all locally stored logs? This action cannot be
                undone.
              </template>

              <template #footer="{ close }">
                <UButton
                  label="Confirm"
                  color="error"
                  @click="
                    async () => {
                      await localDatabase.logs.clear()
                      close()
                    }
                  "
                />
              </template>
            </UModal>
          </div>

          <div v-if="isDevMode">
            <UButton
              color="neutral"
              icon="i-lucide-flask-conical"
              size="lg"
              label="Test Logger"
              @click="onTestLogger"
            />
          </div>
        </div>
      </UPageList>
    </UContainer>
  </UPage>
</template>
