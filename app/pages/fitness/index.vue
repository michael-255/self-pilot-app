<script setup lang="ts">
const title = 'Fitness'
const description = 'This app is still under construction.'

useSeoMeta({
  title,
  description,
})
</script>

<template>
  <UPageHero :title="title" :description="description" />
</template>
