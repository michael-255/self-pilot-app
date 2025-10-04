<script setup lang="ts">
definePageMeta({
  layout: 'journal',
})

const title = 'Journal - Read'
const description = 'Looking back at a writing entry.'

useSeoMeta({
  title,
  description,
})

const route = useRoute()
const { useGetWritingEntry } = useJournal()

const routeId = Array.isArray(route.params.id)
  ? (route.params.id[0] ?? '')
  : (route.params.id ?? '')

const { data: entry } = useGetWritingEntry(routeId)
</script>

<template>
  <UPage>
    <UContainer>{{ entry }} </UContainer>
  </UPage>
</template>
