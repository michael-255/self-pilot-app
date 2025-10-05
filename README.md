# Self Pilot

A collection of tools and mini-apps for day-to-day life.

- [Nuxt](https://nuxt.com/docs/4.x/)
- [Nuxt UI](https://ui.nuxt.com/)

## Next Steps

- NEXT MIGRATION
  - Update delete writing_entry to return a boolean

```sql
CREATE OR REPLACE FUNCTION api_journal.delete_writing_entry(in_id UUID)
RETURNS TABLE (success BOOLEAN)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM app_journal.writing_entries
  WHERE id = in_id
    AND owner_id = auth.uid();
  RETURN QUERY SELECT FOUND;
END;
$$;
```

- `/journal/search` - SEARCH **PRIORITY**
  - `Load more results` button at the bottom
  - each result should have an option to `Read` (goto read route)

- `/journal/read/:id` - READ
  - Use nice typography
  - Show stats (words, time to read)
  - `Edit` button (goto edit route)
  - `Delete` button (ask for confirmation + unlock)

- `/journal/edit/:id` - EDIT
  - On update, goto `read` route with the id (replace?)
  - `Read` button (goto read route)
  - `Delete` button (ask for confirmation + unlock)

- `/journal/metrics` - METRICS (redirect here after creating an entry)
  - Show the last enrty created (can click to read)
  - Show stats on all writings (total writings done)
  - Show stats (words, time to read)
  - Graph of writings over time (day/week/month/year)
  - Most popular categories
  - Average words per writing
  - Average time to read per writing

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
