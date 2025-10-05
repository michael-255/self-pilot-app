import type { PostgrestError } from '@supabase/supabase-js'
import { Constants, type Database } from '~/types/supabase'

/**
 * Composable for journal functionality using Supabase.
 */
export default function useJournal() {
  const supabase = useSupabaseClient<Database>()
  const logger = useLogger()

  type WritingCategory = Database['api_journal']['Enums']['writing_category']

  /**
   * List of writing categories from the database enums.
   */
  const categories = Constants.api_journal.Enums.writing_category.flat()

  /**
   * User's selected search category, persisted in local storage.
   */
  const searchCategory = useLocalStorage<WritingCategory>(
    'selfpilot-search-category',
    Constants.api_journal.Enums.writing_category[0],
  )

  /**
   * User's selected writing category, persisted in local storage.
   */
  const writingCategory = useLocalStorage<WritingCategory>(
    'selfpilot-writing-category',
    Constants.api_journal.Enums.writing_category[0],
  )

  /**
   * User's in-progress writing subject, persisted in local storage.
   */
  const writingSubject = useLocalStorage<string>('selfpilot-writing-subject', '')

  /**
   * User's in-progress writing body, persisted in local storage.
   */
  const writingBody = useLocalStorage<string>('selfpilot-writing-body', '')

  type WritingMetrics = { characters: number; words: number; readingTime: number }

  /**
   * Utility to get the word count and estimated reading time for a given set of texts.
   */
  const getWritingMetrics = (text: string) => {
    let words = 0
    const characters = text.length

    // Calculate word count
    if (text) {
      const segmenter = new Intl.Segmenter('en', { granularity: 'word' })
      for (const segment of segmenter.segment(text)) {
        if (segment.isWordLike) words++
      }
    }

    // Calculate reading time assuming 200 words per minute
    const readingTime = Math.max(0, Math.ceil(words / 200))
    return { characters, words, readingTime }
  }

  /**
   * Fetch the last writing entry that was made.
   */
  const useGetLastWritingEntry = () => {
    type LastWritingEntry =
      Database['api_journal']['Functions']['get_last_writing_entry']['Returns'][number] &
        WritingMetrics & { timeAgo: string }

    const usePending = ref<boolean>(false)
    const useError = ref<PostgrestError | null>(null)
    const useData = ref<LastWritingEntry | null>(null)

    const run = async () => {
      usePending.value = true
      useError.value = null
      useData.value = null

      const { data, error } = await supabase
        .schema('api_journal')
        .rpc('get_last_writing_entry', {})
        .single()

      if (error) {
        useError.value = error
        useData.value = null
      }
      if (data) {
        const metrics = getWritingMetrics(data.body || '')
        const timeAgo = useTimeAgoIntl(data.created_at).value
        const computedData = {
          ...data,
          ...metrics,
          timeAgo,
        }
        useData.value = computedData
        logger.debug(`Fetched last writing entry`, { id: data.id })
      }
      usePending.value = false
    }

    return {
      unused: computed(
        () => !usePending.value && useData.value === null && useError.value === null,
      ),
      data: useData,
      pending: usePending,
      error: useError,
      run,
    }
  }

  /**
   * Searching writing entries with optional filters.
   */
  const useSearchWritingEntries = () => {
    type SearchWritingEntry =
      Database['api_journal']['Functions']['search_writing_entries']['Returns'][number] &
        WritingMetrics & { timeAgo: string }

    const usePending = ref<boolean>(false)
    const useError = ref<PostgrestError | null>(null)
    const useData = ref<SearchWritingEntry[] | null>(null)

    const run = async ({
      category,
      startDate,
      endDate,
      query,
      offset,
    }: {
      category?: WritingCategory
      startDate?: string
      endDate?: string
      query?: string
      offset?: number
    }) => {
      usePending.value = true
      useError.value = null
      useData.value = null

      const { data, error } = await supabase.schema('api_journal').rpc('search_writing_entries', {
        in_category: category,
        in_start_date: startDate,
        in_end_date: endDate,
        in_query: query,
        in_offset: offset,
      })

      if (error) {
        useError.value = error
        useData.value = null
      }
      if (data) {
        useData.value = data.map((entry) => {
          const metrics = getWritingMetrics(entry.body || '')
          const timeAgo = useTimeAgoIntl(entry.created_at).value
          return {
            ...entry,
            ...metrics,
            timeAgo,
          }
        })
        logger.debug(`Searched writing entries`, {
          category,
          startDate,
          endDate,
          query,
          offset,
          ids: [...data.map((d) => d.id)],
        })
      }
      usePending.value = false
    }

    return {
      unused: computed(
        () => !usePending.value && useData.value === null && useError.value === null,
      ),
      data: useData,
      pending: usePending,
      error: useError,
      run,
    }
  }

  /**
   * Get a single writing entry by ID.
   */
  const useGetWritingEntry = () => {
    type GetWritingEntry =
      Database['api_journal']['Functions']['get_writing_entry']['Returns'][number] &
        WritingMetrics & { timeAgo: string }

    const usePending = ref<boolean>(false)
    const useError = ref<PostgrestError | null>(null)
    const useData = ref<GetWritingEntry | null>(null)

    const run = async (id: string) => {
      usePending.value = true
      useError.value = null
      useData.value = null

      const { data, error } = await supabase
        .schema('api_journal')
        .rpc('get_writing_entry', { in_id: id })
        .single()

      if (error) {
        useError.value = error
        useData.value = null
      }
      if (data) {
        const metrics = getWritingMetrics(data.body || '')
        const timeAgo = useTimeAgoIntl(data.created_at).value
        const computedData = {
          ...data,
          ...metrics,
          timeAgo,
        }
        useData.value = computedData
        logger.debug(`Fetched writing entry`, { id })
      }
      usePending.value = false
    }

    return {
      unused: computed(
        () => !usePending.value && useData.value === null && useError.value === null,
      ),
      data: useData,
      pending: usePending,
      error: useError,
      run,
    }
  }

  /**
   * Create a new writing entry.
   */
  const useCreateWritingEntry = () => {
    type CreateWritingEntry =
      Database['api_journal']['Functions']['create_writing_entry']['Returns'][number] &
        WritingMetrics & { timeAgo: string }

    const usePending = ref<boolean>(false)
    const useError = ref<PostgrestError | null>(null)
    const useData = ref<CreateWritingEntry | null>(null)

    const run = async ({
      category,
      subject,
      body,
    }: {
      category: WritingCategory
      subject: string
      body: string
    }) => {
      usePending.value = true
      useError.value = null
      useData.value = null

      const { data, error } = await supabase
        .schema('api_journal')
        .rpc('create_writing_entry', {
          in_category: category,
          in_subject: subject,
          in_body: body,
        })
        .single()

      if (error) {
        useError.value = error
        useData.value = null
      }
      if (data) {
        const metrics = getWritingMetrics(data.body || '')
        const timeAgo = useTimeAgoIntl(data.created_at).value
        const computedData = {
          ...data,
          ...metrics,
          timeAgo,
        }
        useData.value = computedData
        logger.debug(`Created writing entry`, { id: data.id })
      }
      usePending.value = false
    }

    return {
      unused: computed(
        () => !usePending.value && useData.value === null && useError.value === null,
      ),
      data: useData,
      pending: usePending,
      error: useError,
      run,
    }
  }

  /**
   * Update an existing writing entry.
   */
  const useUpdateWritingEntry = () => {
    type UpdateWritingEntry =
      Database['api_journal']['Functions']['update_writing_entry']['Returns'][number] &
        WritingMetrics & { timeAgo: string }

    const usePending = ref<boolean>(false)
    const useError = ref<PostgrestError | null>(null)
    const useData = ref<UpdateWritingEntry | null>(null)

    const run = async ({
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
      usePending.value = true
      useError.value = null
      useData.value = null

      const { data, error } = await supabase
        .schema('api_journal')
        .rpc('update_writing_entry', {
          in_id: id,
          in_category: category,
          in_subject: subject,
          in_body: body,
        })
        .single()

      if (error) {
        useError.value = error
        useData.value = null
      }
      if (data) {
        const metrics = getWritingMetrics(data.body || '')
        const timeAgo = useTimeAgoIntl(data.created_at).value
        const computedData = {
          ...data,
          ...metrics,
          timeAgo,
        }
        useData.value = computedData
        logger.debug(`Updated writing entry`, { id })
      }
      usePending.value = false
    }

    return {
      unused: computed(
        () => !usePending.value && useData.value === null && useError.value === null,
      ),
      data: useData,
      pending: usePending,
      error: useError,
      run,
    }
  }

  /**
   * Delete a writing entry by ID.
   */
  const useDeleteWritingEntry = () => {
    const usePending = ref<boolean>(false)
    const useError = ref<PostgrestError | null>(null)
    const useData = ref<true | null>(null)

    const run = async (id: string) => {
      usePending.value = true
      useError.value = null
      useData.value = null

      const { error } = await supabase
        .schema('api_journal')
        .rpc('delete_writing_entry', { in_id: id })
        .single()

      if (error) {
        useError.value = error
        useData.value = null
      } else {
        useData.value = true
        logger.debug(`Deleted writing entry`, { id })
      }
      usePending.value = false
    }

    return {
      unused: computed(
        () => !usePending.value && useData.value === null && useError.value === null,
      ),
      data: useData,
      pending: usePending,
      error: useError,
      run,
    }
  }

  return {
    categories,
    searchCategory,
    writingCategory,
    writingSubject,
    writingBody,
    getWritingMetrics,
    useGetLastWritingEntry,
    useSearchWritingEntries,
    useGetWritingEntry,
    useCreateWritingEntry,
    useUpdateWritingEntry,
    useDeleteWritingEntry,
  }
}
