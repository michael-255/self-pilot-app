<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import z from 'zod'
import { Constants } from '~/types/supabase'

definePageMeta({
  layout: 'journal',
})

const title = 'Journal - Writing'
const description = 'Write about anything and everything.'

useSeoMeta({
  title,
  description,
})

const logger = useLogger()
const { category, categories, createWritingEntry } = useJournal()

const state = reactive({
  category,
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

const schema = z.object({
  category: z.enum(Constants.api_journal.Enums.writing_category),
  subject: z.string().max(100, 'Subject cannot exceed 100 characters'),
  body: z.string().max(30000, 'Body cannot exceed 30,000 characters'),
})

const onSubmit = async (payload: FormSubmitEvent<z.output<typeof schema>>) => {
  try {
    await createWritingEntry({
      category: payload.data.category,
      subject: payload.data.subject,
      body: payload.data.body,
    })

    state.subject = ''
    state.body = ''

    logger.info('Writing entry created')
  } catch (error) {
    logger.error('Error creating writing entry:', error)
  }
}
</script>

<template>
  <UPage>
    <UContainer class="pb-16">
      <div class="text-lg my-4">Writing for {{ formattedDate }}</div>

      <UForm :schema :state class="space-y-4" @submit="onSubmit">
        <UFormField name="category">
          <USelect
            v-model="state.category"
            :items="categories"
            placeholder="Category"
            size="xl"
            class="w-48"
          />
        </UFormField>

        <UFormField name="subject" class="w-full">
          <UInput
            v-model="state.subject"
            placeholder="What are you writing about?"
            class="w-full"
            size="xl"
          />
        </UFormField>

        <UFormField name="body" class="w-full">
          <UTextarea
            v-model="state.body"
            :placeholder="bodyPlaceholder"
            :rows="16"
            class="w-full"
            size="xl"
          />
        </UFormField>

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
      </UForm>
    </UContainer>
  </UPage>
</template>
