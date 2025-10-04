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

const { searchCategory, categoriesWithAny, useSearchWritingEntries } = useJournal()

const { data } = useSearchWritingEntries({
  query: 'entry',
  offset: 0,
})

const query = ref('')

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

const modelValue = shallowRef({
  start: new CalendarDate(2022, 1, 20),
  end: new CalendarDate(2022, 2, 10),
})
</script>

<template>
  <UPage>
    <UContainer class="pb-16">
      <div class="text-lg my-4">
        Search Writings

        <div class="text-sm text-gray-600 dark:text-gray-400 h-4">
          Use the search box and filters below to look through your writing entries.
        </div>
      </div>

      <USelect
        v-model="searchCategory"
        :items="categoriesWithAny"
        placeholder="Category"
        size="xl"
        class="w-full sm:w-48 mb-4"
      />

      <UInput v-model="query" placeholder="Search..." class="w-full" size="xl" />

      <UPopover>
        <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
          <template v-if="modelValue.start">
            <template v-if="modelValue.end">
              {{ df.format(modelValue.start.toDate(getLocalTimeZone())) }} -
              {{ df.format(modelValue.end.toDate(getLocalTimeZone())) }}
            </template>

            <template v-else>
              {{ df.format(modelValue.start.toDate(getLocalTimeZone())) }}
            </template>
          </template>
          <template v-else> Pick a date </template>
        </UButton>

        <template #content>
          <UCalendar v-model="modelValue" class="p-2" :number-of-months="2" range />
        </template>
      </UPopover>

      <div>
        {{ data }}
      </div>
    </UContainer>
  </UPage>
</template>
