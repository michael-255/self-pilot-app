<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('index').first())

const title = 'Tools and apps for every day'
const description = ''

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description,
})

const features = [
  {
    title: 'Tools',
    description:
      'A collection of useful tools to help you manage your daily tasks and improve productivity.',
    icon: 'i-lucide-wrench',
    to: '/tools',
  },
  {
    title: 'Fitness',
    description: 'Track your workouts, progress, and goals with our comprehensive fitness app.',
    icon: 'i-lucide-dumbbell',
    to: '/fitness',
  },
  {
    title: 'Journal',
    description:
      'Capture your thoughts, ideas, and daily reflections in a secure and private journal.',
    icon: 'i-lucide-book-open',
    to: '/journal',
  },
  {
    title: 'Budget',
    description: 'Manage your finances, track expenses, and plan your budget effectively.',
    icon: 'i-lucide-dollar-sign',
    to: '/budget',
  },
  {
    title: 'Measurements',
    description: 'Keep track of your body measurements and monitor your health progress over time.',
    icon: 'i-lucide-ruler',
    to: '/measurements',
  },
]
</script>

<template>
  <div v-if="page">
    <UPageHero :title="title" :description="description">
      <template #top>
        <HeroBackground />
        <LazyStarsBg />
      </template>

      <template #title>
        <MDC :value="title" unwrap="p" />
      </template>

      <UPageGrid>
        <UPageCard v-for="(item, index) in features" :key="index" v-bind="item" spotlight />
      </UPageGrid>
    </UPageHero>
  </div>
</template>
