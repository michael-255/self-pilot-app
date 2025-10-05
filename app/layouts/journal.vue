<script setup lang="ts">
const route = useRoute()

const items = computed(() => [
  {
    label: 'Writing',
    to: '/journal',
    active: normalizePath(route.path) === normalizePath('/journal'),
  },
  {
    label: 'Search',
    to: '/journal/search',
    active: normalizePath(route.path) === normalizePath('/journal/search'),
  },
  {
    label: 'Metrics',
    to: '/journal/metrics',
    active: normalizePath(route.path) === normalizePath('/journal/metrics'),
  },
])
</script>

<template>
  <div>
    <UHeader>
      <template #left>
        <NuxtLink to="/"> <div class="text-2xl font-bold">Journal</div> </NuxtLink>
      </template>

      <UNavigationMenu :items="items" variant="link" />

      <template #right>
        <UColorModeButton />

        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-log-out"
          to="/"
          class="hidden lg:inline-flex"
        />
      </template>

      <template #body>
        <UNavigationMenu :items="items" orientation="vertical" />

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
