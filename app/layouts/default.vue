<script setup lang="ts">
const route = useRoute()

const items = computed(() => [
  {
    label: 'Home',
    icon: 'i-lucide-home',
    to: '/',
    active: route.path === '/',
  },
  {
    label: 'Tools',
    icon: 'i-lucide-wrench',
    defaultOpen: true,
    active: route.path.startsWith('/tools'),
    children: [
      {
        label: 'Tools (WIP)',
        to: '/tools',
        active: route.path.startsWith('/tools'),
      },
    ],
  },
  {
    label: 'Writing',
    icon: 'i-lucide-notebook-pen',
    active: route.path.startsWith('/writing'),
    defaultOpen: true,
    children: [
      {
        label: 'New Entry',
        to: '/writing/new',
        active: route.path.startsWith('/writing/new'),
      },
      {
        label: 'Search',
        to: '/writing/search',
        active: route.path.startsWith('/writing/search'),
      },
    ],
  },
  {
    label: 'Fitness',
    icon: 'i-lucide-dumbbell',
    defaultOpen: true,
    active: route.path.startsWith('/fitness'),
    children: [
      {
        label: 'Fitness (WIP)',
        to: '/fitness',
        active: route.path.startsWith('/fitness'),
      },
    ],
  },
  {
    label: 'Budget',
    icon: 'i-lucide-wallet',
    defaultOpen: true,
    active: route.path.startsWith('/budget'),
    children: [
      {
        label: 'Budget (WIP)',
        to: '/budget',
        active: route.path.startsWith('/budget'),
      },
    ],
  },
  {
    label: 'Measurements',
    icon: 'i-lucide-ruler',
    defaultOpen: true,
    active: route.path.startsWith('/measurements'),
    children: [
      {
        label: 'Measurements (WIP)',
        to: '/measurements',
        active: route.path.startsWith('/measurements'),
      },
    ],
  },
])
</script>

<template>
  <div>
    <UHeader>
      <template #left>
        <NuxtLink to="/"> <div class="text-2xl font-bold">Self Pilot</div> </NuxtLink>
      </template>

      <UNavigationMenu
        :items
        variant="link"
        content-orientation="vertical"
        :ui="{ linkLeadingIcon: 'hidden' }"
      />

      <template #right>
        <UColorModeButton />

        <UButton
          :color="route.path === '/settings' ? 'primary' : 'neutral'"
          variant="ghost"
          icon="i-lucide-settings"
          to="/settings"
        />
      </template>

      <template #body>
        <UNavigationMenu :items variant="link" orientation="vertical" />
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>
  </div>
</template>
