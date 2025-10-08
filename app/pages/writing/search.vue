<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { categoriesWithAny, useSearchEntries } from '~/composables/useWriting'

definePageMeta({
  layout: 'writing',
})

const title = 'Writing - Search'
const description = 'Search through your writing entries.'

useSeoMeta({
  title,
  description,
})

const { category, calendarDates, query, data, isPending } = useSearchEntries()

const df = new DateFormatter('en-US', { dateStyle: 'medium' })
const today = new Date()
const minDate = new CalendarDate(2015, 1, 1)
const maxDate = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
</script>

<template>
  <UPage>
    <UContainer class="pb-16 space-y-4">
      <div class="text-lg my-4">
        Search Writings

        <div class="text-sm text-gray-600 dark:text-gray-400 h-4">
          Use the filters and search box below to look through your writing entries.
        </div>
      </div>

      <div>
        <USelect
          v-model="category"
          :items="categoriesWithAny"
          placeholder="Category"
          size="xl"
          class="w-full sm:w-48"
        />
      </div>

      <div>
        <UPopover>
          <UButton
            color="neutral"
            variant="subtle"
            icon="i-lucide-calendar-days"
            size="xl"
            class="w-full sm:w-66"
          >
            <template v-if="calendarDates.start">
              <template v-if="calendarDates.end">
                {{ df.format(calendarDates.start.toDate(getLocalTimeZone())) }} -
                {{ df.format(calendarDates.end.toDate(getLocalTimeZone())) }}
              </template>

              <template v-else>
                {{ df.format(calendarDates.start.toDate(getLocalTimeZone())) }}
              </template>
            </template>
            <template v-else> Pick a date range </template>
          </UButton>

          <template #content>
            <UCalendar
              v-model="calendarDates"
              :fixed-weeks="false"
              :min-value="minDate"
              :max-value="maxDate"
              weekday-format="short"
              range
              size="xl"
            />
          </template>
        </UPopover>
      </div>

      <UInput v-model="query" placeholder="Search..." class="w-full" size="xl" />

      <div v-if="!isPending">
        <div v-if="Array.isArray(data)">
          <div v-for="entry in data" :key="entry.id" class="mb-4 p-2 border rounded">
            <div><strong>ID:</strong> {{ entry.id }}</div>
            <div><strong>Date:</strong> {{ entry.created_at }}</div>
            <div><strong>TimeAgo:</strong> {{ entry.timeAgo }}</div>
            <div><strong>Category:</strong> {{ entry.category }}</div>
            <div><strong>Subject:</strong> {{ entry.subject }}</div>
            <div><strong>Body:</strong> {{ entry.body }}</div>
            <div><strong>Chars:</strong> {{ entry.characters }}</div>
            <div><strong>Words:</strong> {{ entry.words }}</div>
            <div><strong>ReadingTime:</strong> {{ entry.readingTime }} min</div>
          </div>
        </div>
        <div v-else>No results found.</div>
      </div>
    </UContainer>
  </UPage>
</template>
