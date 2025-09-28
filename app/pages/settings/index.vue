<script setup lang="ts">
definePageMeta({
  requiresAuth: false,
})

const title = 'Settings'
const description = 'This app is still under construction.'

useSeoMeta({
  titleTemplate: '',
  title,
  description,
})

const route = useRoute()
const authStore = useAuthStore()
const consoleLogs = useLocalStorage('console-logs', true)

const redirectPath = Array.isArray(route.query.redirect)
  ? route.query.redirect[0]
  : route.query.redirect

const links = ref([
  {
    label: 'Back',
    icon: 'i-lucide-chevron-left',
    to: redirectPath || '/',
  },
])

/*
- View Logs (Data Table)
- Delete Logs
*/
</script>

<template>
  <UPage>
    <UPageSection>
      <UPageHeader title="Settings" :links />

      <UPageBody>
        <UUser
          :name="authStore.user.name || 'No user logged in'"
          :description="authStore.user.email || ''"
          :avatar="{ icon: 'i-lucide-user' }"
          size="xl"
        />

        <UPageFeature title="Options" icon="i-lucide-settings-2" />

        <div>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minus placeat repellendus
          voluptatum doloribus dolorem, dolor corrupti! Ratione illo molestiae earum quae, quasi
          enim voluptates ipsam velit exercitationem? Dignissimos, corporis beatae!
        </div>

        <USwitch v-model="consoleLogs" size="lg" label="Console Logs" />

        <UPageFeature title="Data" icon="i-lucide-database" />
      </UPageBody>
    </UPageSection>
  </UPage>
</template>
