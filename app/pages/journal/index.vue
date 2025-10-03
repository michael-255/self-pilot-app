<script setup lang="ts">
definePageMeta({
  layout: 'journal',
})

const title = 'Journal - Writing'
const description = 'Write about anything and everything.'

useSeoMeta({
  title,
  description,
})

// TODO: useJournal
const categories = ['Personal', 'Work', 'Ideas', 'Gratitude', 'Goals', 'Other']

const form = reactive({
  category: '',
  subject: '',
  body: '',
})

function getDaySuffix(day: number) {
  if (day >= 11 && day <= 13) return 'th'
  switch (day % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

const bodyPlaceholder =
  inspirationalMessages[Math.floor(Math.random() * inspirationalMessages.length)]

const today = new Date()
const dayName = today.toLocaleDateString('en-US', { weekday: 'long' })
const monthName = today.toLocaleDateString('en-US', { month: 'long' })
const dayNumber = today.getDate()
const daySuffix = getDaySuffix(dayNumber)
const formattedDate = `${dayName}, ${monthName} ${dayNumber}${daySuffix}`
</script>

<template>
  <UPage>
    <UContainer class="pb-16">
      <div class="text-lg my-4">Writing for {{ formattedDate }}</div>

      <UForm class="space-y-4">
        <UFormField name="category">
          <USelect v-model="form.category" :items="categories" placeholder="Category" size="xl" />
        </UFormField>

        <UFormField name="subject" class="w-full">
          <UInput
            v-model="form.subject"
            placeholder="What are you writing about?"
            class="w-full"
            size="xl"
          />
        </UFormField>

        <UFormField name="body" class="w-full">
          <UTextarea
            v-model="form.body"
            :placeholder="bodyPlaceholder"
            :rows="16"
            class="w-full"
            size="xl"
          />
        </UFormField>
      </UForm>

      <div class="flex justify-end mt-6">
        <UButton
          icon="i-lucide-notebook-pen"
          type="submit"
          color="primary"
          variant="solid"
          size="xl"
        >
          Finish Writing
        </UButton>
      </div>
    </UContainer>
  </UPage>
</template>
