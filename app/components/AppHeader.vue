<script setup lang="ts">
//
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <div class="text-2xl font-bold">Self Pilot</div>
      </NuxtLink>
    </template>

    <template #right>
      <UColorModeButton />

      <UButton
        icon="i-lucide-settings"
        color="neutral"
        variant="ghost"
        to="/settings"
        class="hidden lg:inline-flex"
      />

      <UButton
        label="Login"
        color="neutral"
        variant="outline"
        to="/login"
        class="hidden lg:inline-flex"
      />
    </template>

    <template #body>
      <UButton label="Login" color="neutral" variant="subtle" to="/login" block class="mb-3" />

      <UButton
        label="Settings"
        color="neutral"
        variant="subtle"
        to="/settings"
        block
        class="mb-3"
      />

      <UButton label="Exit" color="error" to="/" block />
    </template>
  </UHeader>
</template>
