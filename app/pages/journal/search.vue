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
      <USelect
        v-model="searchCategory"
        :items="categories"
        placeholder="Category"
        size="xl"
        class="w-48 my-4"
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
