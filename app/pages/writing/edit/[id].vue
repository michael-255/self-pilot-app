<script setup lang="ts">
import z from 'zod'
import ConfirmModal from '~/components/shared/ConfirmModal.vue'
import { Constants } from '~/types/supabase'

definePageMeta({
  layout: 'writing',
})

const title = 'Writing - Edit'
const description = 'Editing a previous writing entry.'

useSeoMeta({
  title,
  description,
})

const logger = useLogger()
const editModal = useOverlay().create(ConfirmModal)
const { routeId } = useRouting()
const { mutateAsync: updateEntry, error: updateError } = useUpdateWritingEntry()
const { id, data, isPending, refetch } = useGetWritingEntry()
id.value = routeId
refetch()

const writingMetrics = computed(() => getWritingMetrics(state.body))

const state = reactive({
  category: 'Journaling' as WritingCategory,
  subject: '' as string,
  body: '' as string,
})

watch(
  () => data.value,
  (entry) => {
    if (entry) {
      state.category = entry.category || 'Journaling'
      state.subject = entry.subject || ''
      state.body = entry.body || ''
    }
  },
  { immediate: true },
)

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
 * Show confirmation modal to edit the writing entry.
 */
const onEditWriting = () => {
  editModal.open({
    title: 'Update Writing',
    description: 'Are you sure you want to save the changes made to this writing entry?',
    color: 'warning',
    unlock: true,
    onConfirm: async () => {
      await updateEntry({
        id: id.value,
        category: state.category,
        subject: state.subject,
        body: state.body,
      })

      if (updateError.value) {
        logger.error('Error updating writing entry', updateError.value)
        return
      }

      logger.info('Writing entry updated', { id: id.value })
      await navigateTo('/writing/read/' + id.value)
    },
  })
}
</script>

<template>
  <UPage>
    <UContainer class="pb-16">
      <div v-if="!isPending && data">
        <div class="text-lg my-6">
          {{ getBriefDisplayDate(new Date().toISOString()) }}

          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ data.timeAgo }}
          </div>
        </div>

        <UForm :schema :state class="space-y-4" @submit="onEditWriting">
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
            <UTextarea v-model="state.body" :rows="20" class="w-full" size="xl" />
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
              label="Cancel"
              color="neutral"
              size="xl"
              variant="soft"
              @click="navigateTo('/writing/read/' + id)"
            />

            <UButton
              label="Save Changes"
              class="ml-4"
              color="warning"
              size="xl"
              variant="soft"
              type="submit"
            />
          </div>
        </UForm>
      </div>

      <div v-else class="mt-6">Entry not found.</div>
    </UContainer>
  </UPage>
</template>
