/**
 * Composable for journal functionality using Supabase RPC and Nuxt useAsyncData.
 */
import type { Database } from '~/types/supabase'

export default function useJournal() {
  const supabase = useSupabaseClient<Database>()
  const logger = useLogger()

  // Fetch categories (view)
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .schema('api_journal')
      .from('writing_categories_view')
      .select('*')

    if (error) {
      logger.error('Error fetching journal categories:', error)
      throw error
    }

    logger.debug('Fetched journal categories:', data)
    return data
  }

  // Search entries (RPC)
  const searchEntries = async (params = {}) => {
    const { data, error } = await supabase
      .schema('api_journal')
      .rpc('search_writing_entries', params)
    if (error) throw error
    return data
  }

  // Get single entry (RPC)
  const getEntry = async (id: string) => {
    const { data, error } = await supabase
      .schema('api_journal')
      .rpc('get_writing_entry', { in_id: id })
    if (error) throw error
    return data?.[0] || null
  }

  // Create entry (RPC)
  const createEntry = async ({
    category_id,
    subject,
    body,
  }: {
    category_id: number
    subject: string
    body: string
  }) => {
    const { data, error } = await supabase.schema('api_journal').rpc('create_writing_entry', {
      in_category_id: category_id,
      in_subject: subject,
      in_body: body,
    })
    if (error) throw error
    return data?.[0] || null
  }

  // Update entry (RPC)
  const updateEntry = async ({
    id,
    category_id,
    subject,
    body,
  }: {
    id: string
    category_id: number
    subject: string
    body: string
  }) => {
    const { data, error } = await supabase.schema('api_journal').rpc('update_writing_entry', {
      in_id: id,
      in_category_id: category_id,
      in_subject: subject,
      in_body: body,
    })
    if (error) throw error
    return data?.[0] || null
  }

  // Delete entry (RPC)
  const deleteEntry = async (id: string) => {
    const { error } = await supabase
      .schema('api_journal')
      .rpc('delete_writing_entry', { in_id: id })
    if (error) throw error
    return true
  }

  return {
    fetchCategories,
    searchEntries,
    getEntry,
    createEntry,
    updateEntry,
    deleteEntry,
  }
}
