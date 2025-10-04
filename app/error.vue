<script setup lang="ts">
import type { NuxtError } from '#app'

const route = useRoute()
const logger = useLogger()

const props = defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true,
  },
})

logger.debug('Error page loaded', { ...props.error })

useHead({
  htmlAttrs: {
    lang: 'en',
  },
})

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.',
})
</script>

<template>
  <div>
    <UHeader :toggle="false">
      <template #left>
        <NuxtLink to="/"> <div class="text-2xl font-bold">Self Pilot</div> </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />

        <UButton
          v-if="!route.path.startsWith('/settings')"
          variant="ghost"
          color="neutral"
          icon="i-lucide-settings"
          to="/settings"
        />

        <UButton
          v-if="route.path.startsWith('/settings')"
          variant="ghost"
          color="neutral"
          icon="i-lucide-x"
          to="/"
        />
      </template>
    </UHeader>

    <UMain>
      <UContainer>
        <UPage>
          <UError :error="error" />
        </UPage>
      </UContainer>
    </UMain>

    <UToaster />
  </div>
</template>
