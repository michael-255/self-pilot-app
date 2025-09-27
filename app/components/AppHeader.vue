<script setup lang="ts">
const authStore = useAuthStore()
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
        v-if="authStore.isLoggedIn"
        label="Logout"
        icon="i-lucide-log-out"
        color="error"
        variant="soft"
        class="hidden lg:inline-flex"
        @click="authStore.onLogout()"
      />

      <UButton
        v-else
        label="Sign In"
        icon="i-lucide-log-in"
        variant="soft"
        class="hidden lg:inline-flex"
        to="/login"
      />
    </template>

    <template #body>
      <div class="space-y-4">
        <UButton label="Settings" color="neutral" variant="subtle" to="/settings" block />
        <UButton label="Logout" color="error" block @click="authStore.onLogout()" />
      </div>
    </template>
  </UHeader>
</template>
