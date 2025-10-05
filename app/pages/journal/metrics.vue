<script setup lang="ts">
definePageMeta({
  layout: 'journal',
})

const title = 'Journal - Metrics'
const description = 'Stats and insights on your writing entries.'

useSeoMeta({
  title,
  description,
})
</script>

<template>
  <UPage>
    <UContainer>Metrics</UContainer>
  </UPage>
</template>
