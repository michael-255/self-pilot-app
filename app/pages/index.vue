<script setup lang="ts">
const cards = [
  {
    title: 'Tools',
    description:
      'A collection of useful tools for every day tasks and random extras. No login required.',
    icon: 'i-lucide-wrench',
    to: '/tools',
  },
  {
    title: 'Writing',
    description: 'Capture your thoughts, ideas, and daily reflections with searchable entries.',
    icon: 'i-lucide-book-open',
    to: '/writing',
  },
  {
    title: 'Fitness',
    description: 'Track your workouts and exercises with the ability to view charts.',
    icon: 'i-lucide-dumbbell',
    to: '/fitness',
  },
  {
    title: 'Budget',
    description: 'Manage your finances, track expenses, and plan your budget effectively.',
    icon: 'i-lucide-dollar-sign',
    to: '/budget',
  },
  {
    title: 'Measurements',
    description: 'Keep track of your diet, body measurements, and monitor your health over time.',
    icon: 'i-lucide-ruler',
    to: '/measurements',
  },
]

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
      <HomeHeroBackground />
      <LazyHomeStarsBg />
    </template>

    <UPageGrid>
      <UPageCard v-for="card in cards" :key="card.to" v-bind="card" spotlight />
    </UPageGrid>
  </UPageHero>
</template>
