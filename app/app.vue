<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const colorMode = useColorMode()
const color = computed(() => (colorMode.value === 'dark' ? '#020618' : 'white'))

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color },
  ],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
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
