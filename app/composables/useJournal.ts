import { Constants, type Database } from '~/types/supabase'

/**
 * Composable for journal functionality using Supabase.
 */
export default function useJournal() {
  const supabase = useSupabaseClient<Database>()
  const logger = useLogger()

  const category = useLocalStorage<Database['api_journal']['Enums']['writing_category']>(
    'selfpilot-writing-category',
    Constants.api_journal.Enums.writing_category[0],
  )
  const categories = Constants.api_journal.Enums.writing_category.flat()

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

      logger.debug(`Fetched writing entry:`, { data, id })
      return data
    })

    return { data, pending, error, refresh }
  }

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

    logger.debug(`Deleted writing entry`, { id })
    return true
  }

  return {
    category,
    categories,
    useSearchWritingEntries,
    useGetWritingEntry,
    createWritingEntry,
    updateWritingEntry,
    deleteWritingEntry,
  }
}
