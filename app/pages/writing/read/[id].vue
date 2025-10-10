<script setup lang="ts">
import ConfirmModal from '~/components/shared/ConfirmModal.vue'
import { useDeleteWritingEntry, useGetWritingEntry } from '~/composables/useWriting'

definePageMeta({
  layout: 'writing',
})

const title = 'Writing - Read'
const description = 'Looking back at a writing entry.'

useSeoMeta({
  title,
  description,
})

const logger = useLogger()
const deleteModal = useOverlay().create(ConfirmModal)
const { routeId } = useRouting()
const { mutateAsync: deleteEntry, error: deleteError } = useDeleteWritingEntry()
const { id, data, isPending, refetch } = useGetWritingEntry()
id.value = routeId
refetch()

/**
 * Show confirmation modal to delete the writing entry.
 */
const onDeleteWriting = () => {
  deleteModal.open({
    title: 'Delete Writing',
    description:
      'Are you sure you want to delete this writing entry? This action cannot be undone.',
    color: 'error',
    unlock: true,
    onConfirm: async () => {
      await deleteEntry({ id: id.value })

      if (deleteError.value) {
        logger.error('Error deleting writing entry', deleteError.value)
        return
      }

      logger.info('Writing entry deleted', { id: id.value })
      await navigateTo('/writing/search')
    },
  })
}
</script>

<template>
  <UPage>
    <UContainer class="pb-16">
      <div v-if="!isPending && data">
        <div class="space-y-6 my-6">
          <div>
            <div class="text-sm text-primary mb-2">{{ data.category }}</div>
            <div>{{ getFullDisplayDate(data.created_at) }}</div>
            <span class="text-xs text-gray-600 dark:text-gray-400">{{ data.timeAgo }}</span>
          </div>

          <USeparator />

          <div>
            <div class="font-semibold text-lg">{{ data.subject || 'no subject' }}</div>
          </div>

          <div class="prose prose-sm dark:prose-invert whitespace-pre-line">
            {{ data.body }}
          </div>

          <UCard variant="soft">
            <div class="flex justify-between">
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Characters</div>
                <div class="text-2xl">
                  {{ data.characters }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Words</div>
                <div class="text-2xl">
                  {{ data.words }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Reading</div>
                <div class="text-2xl">{{ data.readingTime }} min</div>
              </div>
            </div>
          </UCard>

          <div class="flex justify-end mt-5">
            <UButton
              color="warning"
              size="xl"
              variant="soft"
              @click="$router.push(`/writing/edit/${data.id}`)"
            >
              Edit
            </UButton>

            <UButton class="ml-4" size="xl" color="error" variant="soft" @click="onDeleteWriting">
              Delete
            </UButton>
          </div>
        </div>
      </div>

      <div v-else class="mt-6">No entries found.</div>
    </UContainer>
  </UPage>
</template>
