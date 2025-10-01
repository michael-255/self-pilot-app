<script setup lang="ts">
const items = computed(() => [
  {
    label: 'Today',
  },
  {
    label: 'Workouts',
  },
  {
    label: 'Exercises',
  },
])
</script>

<template>
  <div>
    <UHeader>
      <template #left>
        <NuxtLink to="/"> <div class="text-2xl font-bold">Fitness</div> </NuxtLink>
      </template>

      <UNavigationMenu :items="items" variant="link" />

      <template #right>
        <UButton
          label="Exit"
          variant="outline"
          color="neutral"
          icon="i-lucide-log-out"
          class="hidden lg:inline-flex"
          to="/"
        />
      </template>

      <template #body>
        <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />

        <USeparator class="my-6" />

        <UButton
          block
          label="Exit"
          variant="outline"
          color="neutral"
          icon="i-lucide-log-out"
          to="/"
        />
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>
  </div>
</template>
