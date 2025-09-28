<script setup lang="ts">
const authStore = useAuthStore()
const { goToWithRedirect } = useRouting()
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
        class="hidden lg:inline-flex"
        @click="goToWithRedirect('/settings')"
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
        @click="goToWithRedirect('/login')"
      />
    </template>

    <template #body>
      <div class="space-y-4">
        <UButton
          label="Settings"
          color="neutral"
          variant="subtle"
          block
          @click="goToWithRedirect('/settings')"
        />

        <UButton
          v-if="authStore.isLoggedIn"
          label="Logout"
          color="error"
          block
          @click="authStore.onLogout()"
        />

        <UButton v-else label="Sign In" block @click="goToWithRedirect('/login')" />
      </div>
    </template>
  </UHeader>
</template>
