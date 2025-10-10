<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'
import { useSearchEntries } from '~/composables/useWriting'

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

const dfCalendar = new DateFormatter('en-US', { dateStyle: 'medium' })
const dfDisplay = new DateFormatter('en-US', { dateStyle: 'medium', timeStyle: 'short' })
const today = new Date()
const minDate = new CalendarDate(2015, 1, 1)
const maxDate = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
</script>

<template>
  <UPage>
    <UContainer class="pb-16 space-y-4">
      <div class="text-lg my-6">
        Search Entries

        <div class="text-sm text-gray-600 dark:text-gray-400">
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
                {{ dfCalendar.format(calendarDates.start.toDate(getLocalTimeZone())) }} -
                {{ dfCalendar.format(calendarDates.end.toDate(getLocalTimeZone())) }}
              </template>

              <template v-else>
                {{ dfCalendar.format(calendarDates.start.toDate(getLocalTimeZone())) }}
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
        <div v-for="entry in data" :key="entry.id" class="mb-6">
          <div class="relative">
            <UCard
              class="w-full cursor-pointer shadow-md"
              @click="$router.push(`/writing/read/${entry.id}`)"
            >
              <div class="space-y-6">
                <div>
                  <div>
                    <div class="text-sm text-primary">{{ entry.category }}</div>
                    <div class="font-semibold text-lg">{{ entry.subject || 'no subject' }}</div>
                  </div>

                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    <div>{{ dfDisplay.format(new Date(entry.created_at)) }}</div>
                    <span class="text-xs">{{ entry.timeAgo }}</span>
                  </div>
                </div>

                <div
                  class="prose prose-sm dark:prose-invert whitespace-pre-line overflow-hidden text-ellipsis line-clamp-3"
                >
                  {{ entry.body }}
                </div>

                <div class="absolute top-3 right-3">
                  <UBadge icon="i-lucide-book-open" color="neutral" variant="soft"> Read </UBadge>
                </div>

                <div class="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
                  <span><strong>Characters:</strong> {{ entry.characters }}</span>
                  <span><strong>Words:</strong> {{ entry.words }}</span>
                  <span><strong>Reading:</strong> {{ entry.readingTime }} min</span>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>

      <div v-else>No results found.</div>
    </UContainer>
  </UPage>
</template>
