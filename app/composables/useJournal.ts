import type { PostgrestError } from '@supabase/supabase-js'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { Constants, type Database } from '~/types/supabase'

type WritingCategory = Database['api_journal']['Enums']['writing_category']
type WritingMetrics = { characters: number; words: number; readingTime: number }
type LastWritingEntry =
  Database['api_journal']['Functions']['get_last_writing_entry']['Returns'][number] &
    WritingMetrics & { timeAgo: string }
type SearchWritingEntry =
  Database['api_journal']['Functions']['search_writing_entries']['Returns'][number] &
    WritingMetrics & { timeAgo: string }
type GetWritingEntry =
  Database['api_journal']['Functions']['get_writing_entry']['Returns'][number] &
    WritingMetrics & { timeAgo: string }
type CreateWritingEntry =
  Database['api_journal']['Functions']['create_writing_entry']['Returns'][number] &
    WritingMetrics & { timeAgo: string }
type UpdateWritingEntry =
  Database['api_journal']['Functions']['update_writing_entry']['Returns'][number] &
    WritingMetrics & { timeAgo: string }

/**
 * Composable for journal functionality using Supabase. Having almost all RPCs return tables, which
 * requires single return functions to process the data with `data[0]`. Using single and maybeSingle
 * was causing 406 status errors.
 */
export default function useJournal() {
  // Useful values and state for writing entries
  const categories = Constants.api_journal.Enums.writing_category.flat()
  const searchCategory = useLocalStorage<WritingCategory | 'Any Category'>(
    'selfpilot-search-category',
    Constants.api_journal.Enums.writing_category[0],
  )
  const writingCategory = useLocalStorage<WritingCategory>(
    'selfpilot-writing-category',
    Constants.api_journal.Enums.writing_category[0],
  )
  const writingSubject = useLocalStorage<string>('selfpilot-writing-subject', '')
  const writingBody = useLocalStorage<string>('selfpilot-writing-body', '')

  return {
    categories,
    searchCategory,
    writingCategory,
    writingSubject,
    writingBody,
  }
}

/**
 * Vue Query composable to get the last writing entry.
 */
const useGetLastWritingEntry = () => {
  const supabase = useSupabaseClient<Database>()
  const logger = useLogger()

  const result = useQuery<LastWritingEntry | null, PostgrestError>({
    queryKey: ['lastWritingEntry'],
    queryFn: async () => {
      const { data, error } = await supabase.schema('api_journal').rpc('get_last_writing_entry')

      if (error) {
        logger.error('Error fetching last writing entry', error)
        throw error
      }

      if (data && data[0]) {
        const entry = data[0]
        const metrics = getWritingMetrics(entry.body)
        const timeAgo = useTimeAgoIntl(entry.created_at).value
        return {
          ...entry,
          ...metrics,
          timeAgo,
        }
      }

      return null
    },
  })

  return {
    data: result.data,
    isPending: result.isPending,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  }
}

/**
 * Vue Query composable to search writing entries with optional filters.
 */
const useSearchWritingEntries = (params: {
  category: Ref<WritingCategory | undefined | string>
  startDate: Ref<string | undefined>
  endDate: Ref<string | undefined>
  query: Ref<string | undefined>
  offset: Ref<number>
}) => {
  const supabase = useSupabaseClient<Database>()
  const logger = useLogger()

  // Computed queryKey to ensure reactivity on param changes
  const queryKey = computed(() => [
    'searchWritingEntries',
    {
      category: unref(params.category) as WritingCategory | undefined,
      startDate: unref(params.startDate),
      endDate: unref(params.endDate),
      query: unref(params.query),
      offset: unref(params.offset),
    },
  ])

  const result = useQuery<SearchWritingEntry[] | null, PostgrestError>({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase.schema('api_journal').rpc('search_writing_entries', {
        in_category: unref(params.category) as WritingCategory | undefined,
        in_start_date: unref(params.startDate),
        in_end_date: unref(params.endDate),
        in_query: unref(params.query),
        in_offset: unref(params.offset),
      })

      if (error) {
        logger.error('Error searching writing entries', error)
        throw error
      }

      if (data) {
        return data.map((entry) => {
          const metrics = getWritingMetrics(entry.body)
          const timeAgo = useTimeAgoIntl(entry.created_at).value
          return {
            ...entry,
            ...metrics,
            timeAgo,
          }
        })
      }

      return null
    },
    // Always enabled, so initial query runs on mount
    enabled: true,
  })

  return {
    data: result.data,
    isPending: result.isPending,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  }
}

/**
 * Vue Query composable to get a single writing entry by ID.
 */
const useGetWritingEntry = () => {
  const supabase = useSupabaseClient<Database>()
  const logger = useLogger()

  const result = useQuery<GetWritingEntry | null, PostgrestError>({
    enabled: false, // Disable automatic query execution
    queryKey: ['getWritingEntry'],
    queryFn: async (context) => {
      const id = context.queryKey[1] as string
      const { data, error } = await supabase
        .schema('api_journal')
        .rpc('get_writing_entry', { in_id: id })

      if (error) {
        logger.error('Error fetching writing entry', { error, id })
        throw error
      }

      if (data && data[0]) {
        const entry = data[0]
        const metrics = getWritingMetrics(entry.body)
        const timeAgo = useTimeAgoIntl(entry.created_at).value
        return {
          ...entry,
          ...metrics,
          timeAgo,
        }
      }

      return null
    },
  })

  return {
    data: result.data,
    isPending: result.isPending,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  }
}

/**
 * Vue Query composable to create a new writing entry.
 */
const useCreateWritingEntry = () => {
  const supabase = useSupabaseClient<Database>()
  const logger = useLogger()

  const mutation = useMutation<
    CreateWritingEntry | null,
    PostgrestError,
    { category: WritingCategory; subject: string; body: string }
  >({
    mutationFn: async ({ category, subject, body }) => {
      const { data, error } = await supabase.schema('api_journal').rpc('create_writing_entry', {
        in_category: category,
        in_subject: subject,
        in_body: body,
      })

      if (error) {
        logger.error('Error creating writing entry', { error, category, subject, body })
        throw error
      }

      if (data && data[0]) {
        const entry = data[0]
        const metrics = getWritingMetrics(entry.body || '')
        const timeAgo = useTimeAgoIntl(entry.created_at || '').value
        return {
          ...entry,
          ...metrics,
          timeAgo,
        }
      }

      return null
    },
  })

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Vue Query composable to update an existing writing entry.
 */
const useUpdateWritingEntry = () => {
  const supabase = useSupabaseClient<Database>()
  const logger = useLogger()

  const mutation = useMutation<
    UpdateWritingEntry | null,
    PostgrestError,
    { id: string; category: WritingCategory; subject: string; body: string }
  >({
    mutationFn: async ({ id, category, subject, body }) => {
      const { data, error } = await supabase.schema('api_journal').rpc('update_writing_entry', {
        in_id: id,
        in_category: category,
        in_subject: subject,
        in_body: body,
      })

      if (error) {
        logger.error('Error updating writing entry', { error, id, category, subject, body })
        throw error
      }

      if (data && data[0]) {
        const entry = data[0]
        const metrics = getWritingMetrics(entry.body || '')
        const timeAgo = useTimeAgoIntl(entry.created_at || '').value
        return {
          ...entry,
          ...metrics,
          timeAgo,
        }
      }

      return null
    },
  })

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Vue Query composable to delete a writing entry by ID.
 */
const useDeleteWritingEntry = () => {
  const supabase = useSupabaseClient<Database>()
  const logger = useLogger()

  const mutation = useMutation<true | null, PostgrestError, { id: string }>({
    mutationFn: async ({ id }) => {
      const { error } = await supabase
        .schema('api_journal')
        .rpc('delete_writing_entry', { in_id: id })

      // RPC returns void, so if there is no error, we assume success
      if (error) {
        logger.error('Error deleting writing entry', { error, id })
        throw error
      } else {
        // Success means it completed and returns a true value for data
        // This would also return true if the entry did not exist
        logger.debug(`Deleted writing entry (if exists)`, { id })
        return true
      }
    },
  })

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  }
}

export {
  useCreateWritingEntry,
  useDeleteWritingEntry,
  useGetLastWritingEntry,
  useGetWritingEntry,
  useSearchWritingEntries,
  useUpdateWritingEntry,
}
export type { LastWritingEntry, WritingCategory, WritingMetrics }
