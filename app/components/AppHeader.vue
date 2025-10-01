<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <UHeader :toggle="false">
    <template #left>
      <NuxtLink to="/">
        <div class="text-2xl font-bold">Self Pilot</div>
      </NuxtLink>
    </template>

    <template #right>
      <UButton
        icon="i-lucide-settings"
        color="neutral"
        variant="ghost"
        @click="router.push('/settings')"
      />
    </template>
  </UHeader>
</template>
