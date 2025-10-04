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
  const getWritingMetrics = (texts: string[]) => {
    let wordCount = 0

    // Calculate word count
    const combined = texts.filter(Boolean).join(' ')
    const characters = combined.length

    if (combined) {
      const segmenter = new Intl.Segmenter('en', { granularity: 'word' })
      for (const segment of segmenter.segment(combined)) {
        if (segment.isWordLike) wordCount++
      }
    }

    // Calculate reading time assuming 200 words per minute
    const readingTime = Math.max(0, Math.ceil(wordCount / 200))
    return { wordCount, readingTime, characters }
  }

  /**
   * Searching writing entries with optional filters.
   */
  const useSearchWritingEntries = ({
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
    const { data, pending, error, refresh } = useAsyncData(
      `writing_entries_${JSON.stringify({ category, startDate, endDate, query, offset })}`,
      async () => {
        const { data, error } = await supabase.schema('api_journal').rpc('search_writing_entries', {
          in_category: category,
          in_start_date: startDate,
          in_end_date: endDate,
          in_query: query,
          in_offset: offset,
        })

        if (error) {
          logger.error('Error searching writing entries:', error)
          showError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
          })
        }

        logger.debug('Searched writing entries:', data)
        return data
      },
    )

    return { data, pending, error, refresh }
  }

  /**
   * Get a single writing entry by ID.
   */
  const useGetWritingEntry = (id: string) => {
    const { data, pending, error, refresh } = useAsyncData(`writing_entry_${id}`, async () => {
      const { data, error } = await supabase
        .schema('api_journal')
        .rpc('get_writing_entry', { in_id: id })
        .single()

      if (error) {
        logger.error('Error fetching writing entry:', error)
        showError({
          statusCode: 500,
          statusMessage: 'Internal Server Error',
        })
      }

      logger.debug(`Fetched writing entry:`, data)
      return data
    })

    return { data, pending, error, refresh }
  }

  /**
   * Create a new writing entry.
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
      logger.error('Error creating writing entry:', error)
      showError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
      })
    }

    logger.debug('Created writing entry:', data)
    return data
  }

  /**
   * Update an existing writing entry.
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
      logger.error('Error updating writing entry:', error)
      showError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
      })
    }

    logger.debug('Updated writing entry:', data)
    return data
  }

  /**
   * Delete a writing entry by ID.
   */
  const deleteWritingEntry = async (id: string) => {
    const { error } = await supabase
      .schema('api_journal')
      .rpc('delete_writing_entry', { in_id: id })
      .single()

    if (error) {
      logger.error('Error deleting writing entry:', error)
      showError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
      })
    }

    logger.debug(`Deleted writing entry`, id)
    return true
  }

  return {
    categories,
    searchCategory,
    writingCategory,
    writingSubject,
    writingBody,
    getWritingMetrics,
    useSearchWritingEntries,
    useGetWritingEntry,
    createWritingEntry,
    updateWritingEntry,
    deleteWritingEntry,
  }
}
