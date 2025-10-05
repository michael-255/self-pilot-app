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
const {
  writingCategory,
  writingSubject,
  writingBody,
  categories,
  useGetLastWritingEntry,
  useCreateWritingEntry,
  getWritingMetrics,
} = useJournal()
const {
  data: lastEntryData,
  pending: lastEntryPending,
  run: lastEntryRun,
} = useGetLastWritingEntry()
const {
  data: createEntryData,
  error: createEntryError,
  run: createEntryRun,
} = useCreateWritingEntry()

const bodyPlaceholder = getInspirationalMessage()
const writingMetrics = computed(() => getWritingMetrics(state.body))

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
    description: 'Are you ready to finish this writing session and save the result?',
    color: 'primary',
    onConfirm: async () => {
      await createEntryRun({
        category: payload.data.category,
        subject: payload.data.subject,
        body: payload.data.body,
      })

      if (createEntryError.value) {
        logger.error('Error creating writing entry:', createEntryError.value)
        return
      }

      state.subject = ''
      state.body = ''
      await lastEntryRun()
      logger.info('Writing entry finished and saved', createEntryData.value?.id)
    },
  })
}

onMounted(async () => {
  await lastEntryRun()
})
</script>

<template>
  <UPage>
    <UContainer class="pb-16">
      <div class="text-lg my-4">
        Writing for {{ getBriefDisplayDate(new Date().toISOString()) }}

        <USkeleton v-if="lastEntryPending" class="h-4 w-48" />

        <div v-else class="text-sm text-gray-600 dark:text-gray-400 h-4">
          <template v-if="lastEntryData && lastEntryData.timeAgo">
            Last entry was {{ lastEntryData.timeAgo }}
          </template>
          <template v-else> This is your first writing entry! </template>
        </div>
      </div>

      <UForm :schema :state class="space-y-4" @submit="onFinishWriting">
        <UFormField name="category">
          <USelect
            v-model="state.category"
            :items="categories"
            placeholder="Category"
            size="xl"
            class="w-full sm:w-48"
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
            :rows="20"
            class="w-full"
            size="xl"
          />
        </UFormField>

        <UCard variant="soft">
          <div class="flex justify-between">
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Characters</div>
              <div class="text-2xl">
                {{ writingMetrics.characters }}
              </div>
            </div>

            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Words</div>
              <div class="text-2xl">
                {{ writingMetrics.words }}
              </div>
            </div>

            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Reading Time</div>
              <div class="text-2xl">{{ writingMetrics.readingTime }} min</div>
            </div>
          </div>
        </UCard>

        <div class="flex justify-end mt-5">
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
