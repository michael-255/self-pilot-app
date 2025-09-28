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
</script>

<template>
  <UPage>
    <UPageSection>
      <UPageHeader title="Settings" :links />

      <UPageList>
        <UUser
          :name="authStore.user.name || 'No user logged in'"
          :description="authStore.user.email || ''"
          :avatar="{ icon: 'i-lucide-user' }"
          size="xl"
        />

        <br />

        <USwitch v-model="consoleLogs" size="lg" label="Console Logs" />

        <br />

        <UPageFeature title="Data" icon="i-lucide-database" />

        <br />

        <div>
          <UButton color="primary" icon="i-lucide-logs" size="lg"> View Logs </UButton>
        </div>

        <br />

        <div>
          <UButton color="error" icon="i-lucide-trash" size="lg"> Delete Logs </UButton>
        </div>

        <br />

        <div v-for="i in 50" :key="i">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati fugiat temporibus
          adipisci sunt nam, quia quod fuga. Ex amet itaque aliquid quisquam? Adipisci a modi
          provident molestiae ducimus doloremque hic? Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Obcaecati fugiat temporibus adipisci sunt nam, quia quod fuga. Ex amet
          itaque aliquid quisquam? Adipisci a modi provident molestiae ducimus doloremque hic? Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Obcaecati fugiat temporibus adipisci
          sunt nam, quia quod fuga. Ex amet itaque aliquid quisquam? Adipisci a modi provident
          molestiae ducimus doloremque hic?
        </div>
      </UPageList>
    </UPageSection>
  </UPage>
</template>
