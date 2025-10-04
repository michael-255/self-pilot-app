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

const { routeId } = useRouting()
const { useGetWritingEntry } = useJournal()
const { data: entry } = useGetWritingEntry(routeId)
</script>

<template>
  <UPage>
    <UContainer>{{ entry }} </UContainer>
  </UPage>
</template>
