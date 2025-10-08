import type { CalendarDate } from '@internationalized/date'
import type { PostgrestError } from '@supabase/supabase-js'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { Constants, type Database } from '~/types/supabase'

type WritingCategory = Database['api_writing']['Enums']['category']
type WritingMetrics = { characters: number; words: number; readingTime: number }
type SearchWritingEntry =
  Database['api_writing']['Functions']['search_entries']['Returns'][number] &
    WritingMetrics & { timeAgo: string }
type LastWritingEntry = Database['api_writing']['Functions']['get_last_entry']['Returns'][number] &
  WritingMetrics & { timeAgo: string }
type GetWritingEntry = Database['api_writing']['Functions']['get_entry']['Returns'][number] &
  WritingMetrics & { timeAgo: string }
type CreateWritingEntry = Database['api_writing']['Functions']['create_entry']['Returns'][number] &
  WritingMetrics & { timeAgo: string }
type UpdateWritingEntry = Database['api_writing']['Functions']['update_entry']['Returns'][number] &
  WritingMetrics & { timeAgo: string }

// Useful values for writing routes
const categories = Constants.api_writing.Enums.category.flat()
const categoriesWithAny = ['Any Category', ...categories]

/**
 * Composable to search writing entries with optional filters.
 */
const useSearchEntries = () => {
  const supabase = useSupabaseClient<Database>()
  const logger = useLogger()

  // Provide reactive search parameters
  const category = ref<WritingCategory | 'Any Category'>('Any Category')
  const calendarDates = shallowRef<{
    start: CalendarDate | undefined
    end: CalendarDate | undefined
  }>({ start: undefined, end: undefined })
  const query = ref<string | undefined>('')
  const offset = ref<number | undefined>(0)

  // Normalizing params for the RPC call
  const normalizedParams = computed(() => {
    return {
      // If category is 'Any Category', we treat it as undefined
      c: category.value === 'Any Category' ? undefined : category.value,
      // Converting CalendarDate to ISO string for the API
      s: calendarDates.value.start
        ? calendarDates.value.start.toDate('UTC').toISOString()
        : undefined,
      // Converting CalendarDate to end of day ISO string for the API
      e: calendarDates.value.end
        ? (() => {
            const d = calendarDates.value.end.toDate('UTC')
            d.setUTCHours(23, 59, 59, 999)
            return d.toISOString()
          })()
        : undefined,
      // Trim the query to avoid unnecessary spaces
      q: query.value?.trim() === '' ? undefined : query.value?.trim(),
      // Default offset to 0 if not provided
      o: offset.value ?? 0,
    }
  })

  // Debounced queryKey for useQuery doesn't impact first call
  const debouncedQueryKey = useDebounce(
    computed(() => [
      'searchWritingEntries',
      {
        category: normalizedParams.value.c,
        startDate: normalizedParams.value.s,
        endDate: normalizedParams.value.e,
        query: normalizedParams.value.q,
        offset: normalizedParams.value.o,
      },
    ]),
    300,
  )

  const result = useQuery<SearchWritingEntry[] | null, PostgrestError>({
    queryKey: debouncedQueryKey,
    queryFn: async () => {
      const { data, error } = await supabase.schema('api_writing').rpc('search_entries', {
        in_category: normalizedParams.value.c,
        in_start_date: normalizedParams.value.s,
        in_end_date: normalizedParams.value.e,
        in_query: normalizedParams.value.q,
        in_offset: normalizedParams.value.o,
      })

      if (error) {
        logger.error('Error searching writing entries', error)
        throw error
      }

      if (data) {
        const entries = data.map((entry) => {
          const metrics = getWritingMetrics(entry.body)
          const timeAgo = useTimeAgoIntl(entry.created_at).value
          return {
            ...entry,
            ...metrics,
            timeAgo,
          }
        })
        logger.debug('Searched entries', {
          count: entries.length,
          category: normalizedParams.value.c,
          startDate: normalizedParams.value.s,
          endDate: normalizedParams.value.e,
          query: normalizedParams.value.q,
          offset: normalizedParams.value.o,
        })
        return entries
      }

      return null
    },
  })

  return {
    category,
    calendarDates,
    query,
    offset,
    data: result.data,
    isPending: result.isPending,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  }
}

/**
 * Composable to get the last writing entry.
 */
const useGetLastEntry = () => {
  const supabase = useSupabaseClient<Database>()
  const logger = useLogger()

  const result = useQuery<LastWritingEntry | null, PostgrestError>({
    queryKey: ['lastWritingEntry'],
    queryFn: async () => {
      const { data, error } = await supabase.schema('api_writing').rpc('get_last_entry')

      if (error) {
        logger.error('Error fetching last writing entry', error)
        throw error
      }

      if (data && data[0]) {
        const entry = {
          ...data[0],
          ...getWritingMetrics(data[0].body),
          timeAgo: useTimeAgoIntl(data[0].created_at).value,
        }
        logger.debug('Fetched last writing entry', { entry })
        return entry
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
 * Composable to get a single writing entry by ID.
 */
const useGetWritingEntry = () => {
  const supabase = useSupabaseClient<Database>()
  const logger = useLogger()

  const id = ref<string>('')

  const result = useQuery<GetWritingEntry | null, PostgrestError>({
    enabled: false, // Disabled by default, call refetch() to run
    queryKey: ['getWritingEntry'],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema('api_writing')
        .rpc('get_entry', { in_id: id.value })

      if (error) {
        logger.error('Error fetching writing entry', { error, id: id.value })
        throw error
      }

      if (data && data[0]) {
        const entry = {
          ...data[0],
          ...getWritingMetrics(data[0].body),
          timeAgo: useTimeAgoIntl(data[0].created_at).value,
        }
        logger.debug('Fetched writing entry by ID', { entry })
        return entry
      }

      return null
    },
  })

  return {
    id,
    data: result.data,
    isPending: result.isPending,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  }
}

/**
 * Composable to create a new writing entry.
 */
const useCreateWritingEntry = () => {
  const supabase = useSupabaseClient<Database>()
  const logger = useLogger()

  const mutation = useMutation<
    CreateWritingEntry | null,
    PostgrestError,
    { category: WritingCategory; subject: string; body: string }
  >({
    mutationFn: async ({
      category,
      subject,
      body,
    }: {
      category: WritingCategory
      subject: string
      body: string
    }) => {
      const { data, error } = await supabase.schema('api_writing').rpc('create_entry', {
        in_category: category,
        in_subject: subject,
        in_body: body,
      })

      if (error) {
        logger.error('Error creating writing entry', {
          error,
          category: category,
          subject: subject?.length,
          body: body?.length,
        })
        throw error
      }

      if (data && data[0]) {
        const entry = {
          ...data[0],
          ...getWritingMetrics(data[0].body),
          timeAgo: useTimeAgoIntl(data[0].created_at).value,
        }
        logger.debug('Created writing entry', { entry })
        return entry
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
 * Composable to update an existing writing entry.
 */
const useUpdateWritingEntry = () => {
  const supabase = useSupabaseClient<Database>()
  const logger = useLogger()

  const mutation = useMutation<
    UpdateWritingEntry | null,
    PostgrestError,
    { id: string; category: WritingCategory; subject: string; body: string }
  >({
    mutationFn: async ({
      id,
      category,
      subject,
      body,
    }: {
      id: string
      category: WritingCategory
      subject: string
      body: string
    }) => {
      const { data, error } = await supabase.schema('api_writing').rpc('update_entry', {
        in_id: id,
        in_category: category,
        in_subject: subject,
        in_body: body,
      })

      if (error) {
        logger.error('Error updating writing entry', {
          error,
          id,
          category,
          subject: subject?.length,
          body: body?.length,
        })
        throw error
      }

      if (data && data[0]) {
        const entry = {
          ...data[0],
          ...getWritingMetrics(data[0].body),
          timeAgo: useTimeAgoIntl(data[0].created_at).value,
        }
        logger.debug('Updated writing entry', { entry })
        return entry
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
 * Composable to delete a writing entry by ID.
 */
const useDeleteWritingEntry = () => {
  const supabase = useSupabaseClient<Database>()
  const logger = useLogger()

  const mutation = useMutation<true | null, PostgrestError, { id: string }>({
    mutationFn: async ({ id }) => {
      const { error } = await supabase.schema('api_writing').rpc('delete_entry', { in_id: id })

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
  categories,
  categoriesWithAny,
  useCreateWritingEntry,
  useDeleteWritingEntry,
  useGetLastEntry,
  useGetWritingEntry,
  useSearchEntries,
  useUpdateWritingEntry,
}
export type {
  CreateWritingEntry,
  GetWritingEntry,
  LastWritingEntry,
  SearchWritingEntry,
  UpdateWritingEntry,
  WritingCategory,
  WritingMetrics,
}
