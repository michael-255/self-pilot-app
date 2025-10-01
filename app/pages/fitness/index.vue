<script setup lang="ts">
definePageMeta({
  layout: 'fitness',
})

const title = 'Fitness'
const description = 'This app is still under construction.'

useSeoMeta({
  titleTemplate: '',
  title,
  description,
})
</script>

<template>
  <UPageHero :title="title" :description="description">
    <template #top>
      <HeroBackground />
      <LazyStarsBg />
    </template>
  </UPageHero>
</template>
