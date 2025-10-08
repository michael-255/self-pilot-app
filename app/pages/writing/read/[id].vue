<script setup lang="ts">
import { DateFormatter } from '@internationalized/date'
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
const dfDisplay = new DateFormatter('en-US', { dateStyle: 'medium', timeStyle: 'short' })
const { id, data, isPending, refetch } = useGetWritingEntry()
id.value = routeId
refetch()
// TODO: Make a nice custom page for reading entries that doesnt use an ugly card
</script>

<template>
  <UPage>
    <UContainer>
      <div v-if="!isPending && data">
        <div class="relative">
          <UCard class="w-full shadow-md mt-9">
            <template #header>
              <div>
                <div class="text-sm text-primary">{{ data.category }}</div>
                <div class="font-semibold text-lg">{{ data.subject || 'no subject' }}</div>
              </div>

              <div class="text-sm text-gray-600 dark:text-gray-400">
                <div>{{ dfDisplay.format(new Date(data.created_at)) }}</div>
                <div class="text-xs">{{ data.timeAgo }}</div>
              </div>
            </template>

            <div
              class="prose prose-sm dark:prose-invert whitespace-pre-line overflow-hidden text-ellipsis line-clamp-3"
            >
              {{ data.body }}
            </div>

            <div class="absolute top-3 right-3">
              <UBadge icon="i-lucide-book-open" color="neutral" variant="soft"> Read </UBadge>
            </div>

            <template #footer>
              <div class="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
                <span><strong>Characters:</strong> {{ data.characters }}</span>
                <span><strong>Words:</strong> {{ data.words }}</span>
                <span><strong>Reading:</strong> {{ data.readingTime }} min</span>
              </div>
            </template>
          </UCard>
        </div>
      </div>
      <div v-else>No results found.</div>
    </UContainer>
  </UPage>
</template>
