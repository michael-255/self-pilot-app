import { Constants } from '~/types/supabase'

export type SearchParams = {
  query?: string
  category?: WritingCategory | 'Any Category'
  startDate?: string
  endDate?: string
  offset?: number
}

const useSearchWritingEntries = () => {
  // const supabase = useSupabaseClient<Database>()
  // const logger = useLogger()

  const searchCategory = useLocalStorage<WritingCategory | 'Any Category'>(
    'selfpilot-search-category',
    Constants.api_journal.Enums.writing_category[0],
  )

  return { searchCategory }
}

export { useSearchWritingEntries }
