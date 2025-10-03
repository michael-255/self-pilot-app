# Self Pilot

A collection of tools and mini-apps for day-to-day life.

- [Nuxt](https://nuxt.com/docs/4.x/)
- [Nuxt UI](https://ui.nuxt.com/)

## Next Steps

Use Nuxt `useAsyncData` for Supabase calls in your own composables.

- Figure out how you want to use it

```ts
// Example
const useCategories = () => {
  const {
    data: categories,
    pending: categoriesPending,
    error: categoriesError,
    refresh: refreshCategories,
  } = useAsyncData('categories', async () => {
    const { data, error } = await supabase.from('api_journal.writing_categories_view').select('*')

    if (error) {
      logger.error('Error fetching journal categories:', error)
      throw error
    }

    logger.debug('Fetched journal categories:', data)
    return data
  })

  return { categories, categoriesPending, categoriesError, refreshCategories }
}
```

- `writing` - Home route, defaults to a writing inputs (new writing)
  - Store `category`, `subject`, and `body` in Dexie (recallable, offline first)
  - Push to SQL on save, but only clear Dexie after save is confirmed
  - Have a random writing prompt that can be rotated through (build 100+ prompts using AI)
  - Have a badge that lets you know how many writings you've done today/week/month/year/all time
- `writing/read/:id` - read a specific writing
- `writing/edit/:id` - edit a specific writing
- `writings/search` - search writings

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

## Supabase

To create a new SQL migration file.

```sh
supabase migrations new FILE_NAME
```
