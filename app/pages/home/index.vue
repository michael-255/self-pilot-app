<script setup lang="ts">
definePageMeta({
  path: '/',
})

const title = 'Tools and apps for every day'
const description = getInspirationalMessage()

useSeoMeta({
  title,
  description,
})
</script>

<template>
  <UPageHero :title :description>
    <template #top>
      <HeroBackground />
      <StarsBg />
    </template>
  </UPageHero>
</template>
