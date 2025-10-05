<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

definePageMeta({
  layout: 'journal',
})

const title = 'Journal - Search'
const description = 'Search through your writing entries.'

useSeoMeta({
  title,
  description,
})

const { searchCategory, categories, useSearchWritingEntries } = useJournal()

const categoriesWithAny = ['Any Category', ...categories]

const query = ref('')

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

const today = new Date()
const tenDaysAgo = new Date(today)
tenDaysAgo.setDate(today.getDate() - 10)

const modelValue = shallowRef({
  start: new CalendarDate(
    tenDaysAgo.getFullYear(),
    tenDaysAgo.getMonth() + 1,
    tenDaysAgo.getDate(),
  ),
  end: new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()),
})

const minDate = new CalendarDate(today.getFullYear() - 50, today.getMonth() + 1, today.getDate())
const maxDate = new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())

// const startDateIso = modelValue.value.start.toDate('UTC').toISOString()
const endDateObj = modelValue.value.end.toDate('UTC')
endDateObj.setUTCHours(23, 59, 59, 999)
// const endDateIso = endDateObj.toISOString()

const { data, pending, run } = useSearchWritingEntries()

const onSearch = async (offset: number = 0) => {
  // Trim the query to avoid unnecessary spaces
  const inputQuery = query.value.trim() === '' ? undefined : query.value.trim()
  // @ts-expect-error - "Any Category" is included for ignoring the category filter
  const inputCategory = searchCategory.value === 'Any Category' ? undefined : searchCategory.value
  // Converting CalendarDate to ISO string for the API
  const inputStartDate = modelValue.value.start
    ? modelValue.value.start.toDate('UTC').toISOString()
    : undefined
  // Converting CalendarDate to end of day ISO string for the API
  const inputEndDate = modelValue.value.end
    ? (() => {
        const d = modelValue.value.end.toDate('UTC')
        d.setUTCHours(23, 59, 59, 999)
        return d.toISOString()
      })()
    : undefined

  await run({
    query: inputQuery,
    category: inputCategory,
    startDate: inputStartDate,
    endDate: inputEndDate,
    offset,
  })
}

onMounted(async () => {
  // TODO: may not want a query to run on mount so I have to be intentional about it
  // await run({
  //   startDate: startDateIso,
  //   endDate: endDateIso,
  // })
})
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
          v-model="searchCategory"
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
            <template v-if="modelValue.start">
              <template v-if="modelValue.end">
                {{ df.format(modelValue.start.toDate(getLocalTimeZone())) }} -
                {{ df.format(modelValue.end.toDate(getLocalTimeZone())) }}
              </template>

              <template v-else>
                {{ df.format(modelValue.start.toDate(getLocalTimeZone())) }}
              </template>
            </template>
            <template v-else> Pick a date range </template>
          </UButton>

          <template #content>
            <UCalendar
              v-model="modelValue"
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

      <div>
        <UButton
          label="Search"
          color="primary"
          icon="i-lucide-text-search"
          size="xl"
          @click="onSearch()"
        />
      </div>

      <div v-if="!pending">
        <div v-if="Array.isArray(data)">
          <div v-for="entry in data" :key="entry.id" class="mb-4 p-2 border rounded">
            <div><strong>Subject:</strong> {{ entry.subject }}</div>
            <div><strong>Category:</strong> {{ entry.category }}</div>
            <div><strong>Date:</strong> {{ entry.created_at }}</div>
            <div><strong>Body:</strong> {{ entry.body }}</div>
            <div><strong>TimeAgo:</strong> {{ entry.timeAgo }}</div>
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
