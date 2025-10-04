# Self Pilot

A collection of tools and mini-apps for day-to-day life.

- [Nuxt](https://nuxt.com/docs/4.x/)
- [Nuxt UI](https://ui.nuxt.com/)

## Next Steps

- Build a modal component (for confirmations/deletes)?

- `/journal` - HOME (new writing entry)
  - Writing prompt that can be rotated through (build 100+ prompts using AI for each category)
  - Show stats (words, time to read)

- `/journal/metrics` - METRICS (_review_)
  - Show stats (words, time to read)
  - Graph of writings over time (day/week/month/year)
  - Most popular categories
  - Average words per writing
  - Average time to read per writing

- `/journal/read/:id` - READ
  - Use nice typography
  - Show stats (words, time to read)
  - `Edit` button (goto edit route)
  - `Delete` button (ask for confirmation)

- `/journal/edit/:id` - EDIT
  - On update, goto `read` route with the id (replace?)
  - `Read` button (goto read route)
  - `Delete` button (ask for confirmation)

- `/journal/search` - SEARCH **PRIORITY**
  - Search by category, start date, end date, and search query
  - list up to 20 results at a time
  - Show stats on each result (words, time to read)
  - `Load more results` button at the bottom
  - each result should have a menu to `read`, `edit`, and `delete`

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
