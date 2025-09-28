<script setup lang="ts">
const title = 'Measurements'
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
