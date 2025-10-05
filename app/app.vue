<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const colorMode = useColorMode()
const color = computed(() => (colorMode.value === 'dark' ? '#020618' : 'white'))

const config = useRuntimeConfig()
const baseUrl = config.app.baseURL || ''

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'background-color', content: 'black' },
    { key: 'theme-color', name: 'theme-color', content: color },
  ],
  link: [
    { rel: 'icon', href: `${baseUrl}favicon.ico` },
    { rel: 'icon', type: 'image/svg+xml', href: `${baseUrl}favicon.svg` },
    { rel: 'manifest', href: `${baseUrl}manifest.webmanifest` },
    {
      rel: 'apple-touch-icon',
      href: `${baseUrl}apple-touch-icon.png`,
      sizes: '180x180',
      type: 'image/png',
    },
    { rel: 'icon', href: `${baseUrl}favicon-96x96.png`, sizes: '96x96', type: 'image/png' },
    { rel: 'icon', href: `${baseUrl}icon-192x192.png`, sizes: '192x192', type: 'image/png' },
    { rel: 'icon', href: `${baseUrl}icon-512x512.png`, sizes: '512x512', type: 'image/png' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

useSeoMeta({
  titleTemplate: 'Self Pilot - %s',
})

const logger = useLogger()
const showScrollTop = ref(false)

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)

  try {
    const logsDeleted = await localDatabase.deleteExpiredLogs()

    if (logsDeleted > 0) {
      logger.debug('Expired logs deleted', logsDeleted)
    } else {
      logger.debug('No expired logs to delete')
    }
  } catch (error) {
    logger.error('Error deleting expired logs', error)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  showScrollTop.value = window.scrollY > window.innerHeight * 1.5
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UButton
      v-if="showScrollTop"
      icon="i-lucide-arrow-up"
      color="primary"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 shadow-lg"
      size="lg"
      aria-label="Scroll to top"
      @click="scrollToTop"
    />
  </UApp>
</template>
