<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import z from 'zod'
import ConfirmModal from '~/components/shared/ConfirmModal.vue'
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

const modal = useOverlay().create(ConfirmModal)
const logger = useLogger()
const { writingCategory, writingSubject, writingBody, categories, createWritingEntry } =
  useJournal()
const bodyPlaceholder = getInspirationalMessage()

const state = reactive({
  category: writingCategory,
  subject: writingSubject,
  body: writingBody,
})

const MAX_JOURNAL_SUBJECT = 100
const MAX_JOURNAL_BODY = 30000

const schema = z.object({
  category: z.enum(Constants.api_journal.Enums.writing_category),
  subject: z
    .string()
    .max(MAX_JOURNAL_SUBJECT, `Subject cannot exceed ${MAX_JOURNAL_SUBJECT} characters`),
  body: z.string().max(MAX_JOURNAL_BODY, `Body cannot exceed ${MAX_JOURNAL_BODY} characters`),
})

/**
 * Show confirmation modal to finish the writing session and save it.
 */
const onFinishWriting = (payload: FormSubmitEvent<z.output<typeof schema>>) => {
  modal.open({
    title: 'Finished Writing',
    description: 'Are you ready to finish this writing session and save it?',
    color: 'primary',
    onConfirm: async () => {
      try {
        await createWritingEntry({
          category: payload.data.category,
          subject: payload.data.subject,
          body: payload.data.body,
        })

        state.subject = ''
        state.body = ''

        logger.info('Writing entry finished and saved')
      } catch (error) {
        logger.error('Error creating writing entry:', error)
      }
    },
  })
}
</script>

<template>
  <UPage>
    <UContainer class="pb-16">
      <div class="text-lg my-4">
        Writing for {{ getBriefDisplayDate(new Date().toISOString()) }}
      </div>

      <UForm :schema :state class="space-y-4" @submit="onFinishWriting">
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
            label="Finished Writing"
            icon="i-lucide-notebook-pen"
            type="submit"
            color="primary"
            variant="solid"
            size="xl"
          />
        </div>
      </UForm>
    </UContainer>
  </UPage>
</template>
