<script setup lang="ts">
import { useGetWritingEntry } from '~/composables/useWriting'

definePageMeta({
  layout: 'writing',
})

const title = 'Writing - Read'
const description = 'Looking back at a writing entry.'

useSeoMeta({
  title,
  description,
})

const { routeId } = useRouting()
const { id, data, isPending, refetch } = useGetWritingEntry()
id.value = routeId
refetch()
</script>

<template>
  <UPage>
    <UContainer>
      <div v-if="!isPending && data" class="mb-4 p-2 border rounded">
        <div><strong>ID:</strong> {{ data.id }}</div>
        <div><strong>Date:</strong> {{ data.created_at }}</div>
        <div><strong>TimeAgo:</strong> {{ data.timeAgo }}</div>
        <div><strong>Category:</strong> {{ data.category }}</div>
        <div><strong>Subject:</strong> {{ data.subject }}</div>
        <div><strong>Body:</strong> {{ data.body }}</div>
        <div><strong>Chars:</strong> {{ data.characters }}</div>
        <div><strong>Words:</strong> {{ data.words }}</div>
        <div><strong>ReadingTime:</strong> {{ data.readingTime }} min</div>
      </div>
      <div v-else>No results found.</div>
    </UContainer>
  </UPage>
</template>
