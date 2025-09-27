<script setup lang="ts">
const authStore = useAuthStore()

const title = 'Tools and apps for every day'
const description = ''

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description,
})
</script>

<template>
  <UPageHero :title="title" :description="description">
    <template #top>
      <HeroBackground />
      <LazyStarsBg />
    </template>

    <template #title>
      <MDC :value="title" unwrap="p" />
    </template>

    <UPageGrid>
      <UPageCard
        spotlight
        icon="i-lucide-wrench"
        title="Tools"
        description="A collection of useful tools for every day tasks and random extras. No login required."
        to="/tools"
        variant="outline"
      />

      <UPageCard
        spotlight
        icon="i-lucide-dumbbell"
        title="Fitness"
        description="Track your workouts and exercises with the ability to view charts."
        :to="authStore.isLoggedIn ? '/fitness' : '/login'"
      />

      <UPageCard
        spotlight
        icon="i-lucide-book-open"
        title="Journal"
        description="Capture your thoughts, ideas, and daily reflections in a searchable journal."
        :to="authStore.isLoggedIn ? '/journal' : '/login'"
      />

      <UPageCard
        spotlight
        icon="i-lucide-dollar-sign"
        title="Budget"
        description="Manage your finances, track expenses, and plan your budget effectively."
        :to="authStore.isLoggedIn ? '/budget' : '/login'"
      />

      <UPageCard
        spotlight
        icon="i-lucide-ruler"
        title="Measurements"
        description="Keep track of your diet, body measurements, and monitor your health over time."
        :to="authStore.isLoggedIn ? '/measurements' : '/login'"
      />
    </UPageGrid>
  </UPageHero>
</template>
