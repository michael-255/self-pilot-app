import type { PostgrestError } from '@supabase/supabase-js'
import { computed } from 'vue'
import { Constants, type Database } from '~/types/supabase'

/**
 * Composable for journal functionality using Supabase.
 */
export default function useJournal() {
  const supabase = useSupabaseClient<Database>()
  const logger = useLogger()

  /**
   * List of writing categories from the database enums.
   */
  const categories = Constants.api_journal.Enums.writing_category.flat()

  /**
   * User's selected search category, persisted in local storage.
   */
  const searchCategory = useLocalStorage<Database['api_journal']['Enums']['writing_category']>(
    'selfpilot-search-category',
    Constants.api_journal.Enums.writing_category[0],
  )

  /**
   * User's selected writing category, persisted in local storage.
   */
  const writingCategory = useLocalStorage<Database['api_journal']['Enums']['writing_category']>(
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

  /**
   * Utility to get the word count and estimated reading time for a given set of texts.
   */
  const getWritingMetrics = (text: string) => {
    let wordCount = 0
    const characters = text.length

    // Calculate word count
    if (text) {
      const segmenter = new Intl.Segmenter('en', { granularity: 'word' })
      for (const segment of segmenter.segment(text)) {
        if (segment.isWordLike) wordCount++
      }
    }

    // Calculate reading time assuming 200 words per minute
    const readingTime = Math.max(0, Math.ceil(wordCount / 200))
    return { characters, wordCount, readingTime }
  }

  /**
   * Fetch the date of the last writing entry.
   */
  const useGetLastWritingDate = () => {
    const useRan = ref<boolean>(false)
    const usePending = ref<boolean>(false)
    const useError = ref<PostgrestError | null>(null)
    const useData = ref<string | null>(null)

    const run = async () => {
      usePending.value = true
      useError.value = null
      useData.value = null

      const { data, error } = await supabase
        .schema('api_journal')
        .rpc('get_last_writing_date')
        .single()

      if (error) {
        useError.value = error
        useData.value = null
      }
      if (data) {
        useData.value = data
      }
      usePending.value = false
      useRan.value = true
    }

    const lastWritingTimeAgo = computed(() => {
      if (!useData.value) return ''
      return useTimeAgoIntl(useData.value)
    })

    return {
      lastWritingTimeAgo,
      ran: useRan,
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
    const useRan = ref<boolean>(false)
    const usePending = ref<boolean>(false)
    const useError = ref<PostgrestError | null>(null)
    const useData = ref<
      Database['api_journal']['Functions']['search_writing_entries']['Returns'] | null
    >(null)

    const run = async ({
      category,
      startDate,
      endDate,
      query,
      offset,
    }: {
      category?: Database['api_journal']['Enums']['writing_category']
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
        useData.value = data
      }
      usePending.value = false
      useRan.value = true
    }

    return { ran: useRan, data: useData, pending: usePending, error: useError, run }
  }

  /**
   * Get a single writing entry by ID.
   * TODO: Refactor to not use useAsyncData
   */
  const useGetWritingEntry = (id: string) => {
    const { data, pending, error, refresh } = useAsyncData(`writing_entry_${id}`, async () => {
      const { data, error } = await supabase
        .schema('api_journal')
        .rpc('get_writing_entry', { in_id: id })
        .single()

      if (error) throw error

      logger.debug(`Fetched writing entry:`, data)
      return data
    })

    return { data, pending, error, refresh }
  }

  /**
   * Create a new writing entry.
   * TODO: Refactor to composable?
   */
  const createWritingEntry = async ({
    category,
    subject,
    body,
  }: {
    category: Database['api_journal']['Enums']['writing_category']
    subject: string
    body: string
  }) => {
    const { data, error } = await supabase
      .schema('api_journal')
      .rpc('create_writing_entry', {
        in_category: category,
        in_subject: subject,
        in_body: body,
      })
      .single()

    if (error) {
      return { data: null, error }
    }

    logger.debug('Created writing entry:', data)
    return { data, error: null }
  }

  /**
   * Update an existing writing entry.
   * TODO: Refactor to composable?
   */
  const updateWritingEntry = async ({
    id,
    category,
    subject,
    body,
  }: {
    id: string
    category: Database['api_journal']['Enums']['writing_category']
    subject: string
    body: string
  }) => {
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
      return { data: null, error }
    }

    logger.debug('Updated writing entry:', data)
    return { data, error: null }
  }

  /**
   * Delete a writing entry by ID.
   * TODO: Refactor to composable?
   */
  const deleteWritingEntry = async (id: string) => {
    const { error } = await supabase
      .schema('api_journal')
      .rpc('delete_writing_entry', { in_id: id })
      .single()

    if (error) {
      return { data: null, error }
    }

    logger.debug(`Deleted writing entry`, id)
    return { data: true, error: null }
  }

  return {
    categories,
    searchCategory,
    writingCategory,
    writingSubject,
    writingBody,
    getWritingMetrics,
    useGetLastWritingDate,
    useSearchWritingEntries,
    useGetWritingEntry,
    createWritingEntry,
    updateWritingEntry,
    deleteWritingEntry,
  }
}
