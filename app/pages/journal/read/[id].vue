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
const { data, run } = useGetWritingEntry()

onMounted(async () => {
  await run(routeId)
})
</script>

<template>
  <UPage>
    <UContainer>{{ data }} </UContainer>
  </UPage>
</template>
