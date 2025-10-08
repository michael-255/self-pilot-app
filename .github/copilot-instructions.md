# Copilot Instructions for Self Pilot App

This guide helps AI coding agents work productively in the Self Pilot App codebase. It summarizes
architecture, workflows, and conventions specific to this project.

## Architecture Overview

- **Monorepo Structure:** Contains multiple Nuxt-based apps (see `self-pilot-app/`,
  `lifestyle-manager-v1/`).
- **Nuxt 4 & Nuxt UI:** Main frontend framework. Key files: `nuxt.config.ts`, `app/`, `components/`,
  `layouts/`, `pages/`.
- **Supabase Integration:** Used for backend/database. See `supabase/` for migrations, config, and
  edge functions.
- **Feature Domains:** Apps are organized by domain (journal, fitness, budget, measurements) with
  dedicated folders under `components/`, `layouts/`, and `pages/`.

## Developer Workflows

- **Install dependencies:**
  ```bash
  pnpm install
  ```
- **Start dev server:**
  ```bash
  pnpm dev
  ```
- **Build for production:**
  ```bash
  pnpm build
  pnpm preview
  ```
- **Supabase migrations:**
  ```bash
  npx supabase migrations new <file_name>
  ```
- **Create Supabase Edge Function:**
  ```bash
  npx supabase functions new <file_name>
  ```

## Project-Specific Patterns

- **Offline-first journaling:** Journal entries are first stored in Dexie (client-side), then synced
  to Postgres via Supabase. See `composables/useWriting.ts`.
- **Component Organization:** Shared UI and domain-specific components are separated (e.g.,
  `components/shared/`, `components/journal/`).
- **Routing:** Page routes follow Nuxt conventions, but feature-specific routes (e.g.,
  `/journal/search`, `/journal/read/:id`) have custom logic for navigation and state.
- **Metrics & Stats:** Writing and fitness modules include stats and graphs (see
  `layouts/metrics.vue`, `components/fitness/`).

## Integration Points

- **Nuxt UI:** Used for UI components. See [Nuxt UI docs](https://ui.nuxt.com/).
- **Supabase:** Database and backend logic. See `supabase/README.md` for migration and function
  commands.

## Conventions & Tips

- **Use pnpm for all package management.**
- **Follow domain folder structure for new features.**
- **Reference README.md files for workflow details.**
- **Prefer composables for cross-cutting logic (see `composables/`).**
- **Check for custom logic in `scripts/` for local setup and automation.**

## Key Files & Directories

- `nuxt.config.ts`, `app/`, `components/`, `layouts/`, `pages/`, `composables/`, `supabase/`,
  `scripts/`

---

For unclear or missing conventions, ask for clarification or check related README files in each
domain.
