<script setup lang="ts">
definePageMeta({
  requiresAuth: false,
  layout: 'feature',
  featureTitle: 'Settings',
  featureReturnTo: '/',
  featureReturnLabel: 'Home',
})

const open = ref(false) // TODO
const isDevMode = import.meta.env.DEV
const title = 'Settings'
const description = 'This app is still under construction.'

useSeoMeta({
  titleTemplate: '',
  title,
  description,
})

const route = useRoute()
const router = useRouter()
const { goToWithRedirect } = useRouting()
const logger = useLogger()
const authStore = useAuthStore()

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
    <UPageSection>
      <UPageList class="space-y-9">
        <div>
          <UPageFeature
            icon="i-lucide-user"
            title="Profile"
            description="User profile information when signed in."
            class="mb-4"
          />
          <div class="ml-8 space-y-4">
            <UUser
              v-if="authStore.isLoggedIn"
              :name="authStore.user.name || 'Anonymous'"
              :description="authStore.user.email || 'None'"
              :avatar="
                authStore.user.name
                  ? { text: authStore.user.name.slice(0, 2) }
                  : { icon: 'i-lucide-user' }
              "
              size="xl"
            />

            <UUser
              v-else
              name="No user"
              description="Please sign in"
              :avatar="{ icon: 'i-lucide-circle-off' }"
              size="xl"
            />

            <UButton
              v-if="authStore.isLoggedIn"
              label="Logout"
              color="error"
              icon="i-lucide-log-out"
              @click="authStore.onLogout()"
            />

            <UButton
              v-else
              label="Sign In"
              icon="i-lucide-log-in"
              @click="goToWithRedirect('/login')"
            />
          </div>
        </div>

        <div class="space-y-4">
          <UPageFeature
            title="Logs"
            icon="i-lucide-logs"
            description="View or delete client side application logs."
            class="mb-4"
          />
          <div class="ml-8 space-y-4">
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
        </div>
      </UPageList>
    </UPageSection>
  </UPage>
</template>
