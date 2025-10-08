<script setup lang="ts">
const route = useRoute()

const items = computed(() => [
  {
    label: 'Entry',
    to: '/writing',
    active: normalizePath(route.path) === normalizePath('/writing'),
  },
  {
    label: 'Search',
    to: '/writing/search',
    active: normalizePath(route.path) === normalizePath('/writing/search'),
  },
  {
    label: 'Metrics',
    to: '/writing/metrics',
    active: normalizePath(route.path) === normalizePath('/writing/metrics'),
  },
])
</script>

<template>
  <div>
    <UHeader>
      <template #left>
        <NuxtLink to="/"> <div class="text-2xl font-bold">Writing</div> </NuxtLink>
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
