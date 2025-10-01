<script setup lang="ts">
definePageMeta({
  layout: 'budget',
})

const title = 'Budget'
const description = 'This app is still under construction.'

useSeoMeta({
  title,
  description,
})
</script>

<template>
  <UPageHero :title="title" :description="description">
    <template #top>
      <HomeHeroBackground />
      <LazyHomeStarsBg />
    </template>
  </UPageHero>
</template>
