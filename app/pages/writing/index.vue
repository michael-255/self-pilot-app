<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import z from 'zod'
import ConfirmModal from '~/components/shared/ConfirmModal.vue'
import { categories, useGetLastEntry } from '~/composables/useWriting'
import { Constants } from '~/types/supabase'

definePageMeta({
  layout: 'writing',
})

const title = 'Writing - Entry'
const description = 'Write about anything and everything.'

useSeoMeta({
  title,
  description,
})

const logger = useLogger()

const createModal = useOverlay().create(ConfirmModal)

const { data, isPending, refetch } = useGetLastEntry()
const {
  data: createEntryData,
  error: createEntryError,
  mutateAsync: createEntry,
} = useCreateWritingEntry()

const bodyPlaceholder = getInspirationalMessage()
const writingMetrics = computed(() => getWritingMetrics(state.body))

const state = reactive({
  category: useLocalStorage<WritingCategory>('selfpilot-writing-category', 'Journaling'),
  subject: useLocalStorage<string>('selfpilot-writing-subject', ''),
  body: useLocalStorage<string>('selfpilot-writing-body', ''),
})

const MAX_WRITING_SUBJECT = 100
const MAX_WRITING_BODY = 50_000

const schema = z.object({
  category: z.enum(Constants.api_writing.Enums.category),
  subject: z
    .string()
    .max(MAX_WRITING_SUBJECT, `Subject cannot exceed ${MAX_WRITING_SUBJECT} characters`),
  body: z.string().max(MAX_WRITING_BODY, `Body cannot exceed ${MAX_WRITING_BODY} characters`),
})

/**
 * Show confirmation modal to finish the writing session and save it.
 */
const onFinishWriting = (payload: FormSubmitEvent<z.output<typeof schema>>) => {
  createModal.open({
    title: 'Finish Writing',
    description: 'Are you ready to finish this writing session and save the result?',
    color: 'primary',
    onConfirm: async () => {
      await createEntry({
        category: payload.data.category,
        subject: payload.data.subject,
        body: payload.data.body,
      })

      if (createEntryError.value) {
        logger.error('Error creating writing entry:', createEntryError.value)
        return
      }

      if (!createEntryData.value) {
        logger.error('No data returned after creating writing entry')
        return
      }

      state.subject = ''
      state.body = ''
      logger.info('Writing entry finished and saved', createEntryData.value.id)
      await navigateTo('/writing/read/' + createEntryData.value.id)
    },
  })
}

onMounted(async () => {
  await refetch()
})
</script>

<template>
  <UPage>
    <UContainer class="pb-16">
      <div class="text-lg my-6">
        {{ getBriefDisplayDate(new Date().toISOString()) }}

        <USkeleton v-if="isPending" class="w-48" />

        <div v-else class="text-sm text-gray-600 dark:text-gray-400">
          <template v-if="data && data.timeAgo"> Last entry was {{ data.timeAgo }} </template>
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
              <div class="text-sm text-gray-600 dark:text-gray-400">Reading</div>
              <div class="text-2xl">{{ writingMetrics.readingTime }} min</div>
            </div>
          </div>
        </UCard>

        <div class="flex justify-end mt-5">
          <UButton
            label="Finish Writing"
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
