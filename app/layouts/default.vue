<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div>
    <UHeader :toggle="false">
      <template #left>
        <NuxtLink to="/"> <div class="text-2xl font-bold">Self Pilot</div> </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />

        <UButton
          v-if="!route.path.startsWith('/settings')"
          variant="ghost"
          color="neutral"
          icon="i-lucide-settings"
          to="/settings"
        />

        <UButton
          v-if="route.path.startsWith('/settings')"
          variant="ghost"
          color="neutral"
          icon="i-lucide-x"
          to="/"
        />
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>
  </div>
</template>
