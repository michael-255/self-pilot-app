--
-- Schemas
--
CREATE SCHEMA IF NOT EXISTS api_journal AUTHORIZATION postgres;
GRANT USAGE ON SCHEMA api_journal TO authenticated, service_role;

CREATE SCHEMA IF NOT EXISTS app_journal AUTHORIZATION postgres;
GRANT USAGE ON SCHEMA app_journal TO authenticated, service_role;

--
-- Enums
--
CREATE TYPE api_journal.writing_category AS ENUM (
  'Journaling',
  'Weekly Review',
  'Yearly Review',
  'Goals & Planning',
  'Brainstorming',
  'Creative',
  'Other'
);

--
-- Tables
--
CREATE TABLE app_journal.writing_entries (
  id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  owner_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  category api_journal.writing_category NOT NULL,
  subject TEXT NOT NULL CHECK (char_length(subject) <= 100),
  body TEXT NOT NULL CHECK (char_length(body) <= 30000),
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', COALESCE(subject, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(body, '')), 'B')
  ) STORED
);

CREATE INDEX IF NOT EXISTS writing_entries_search_vector_idx
  ON app_journal.writing_entries USING GIN (search_vector);

ALTER TABLE app_journal.writing_entries ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON app_journal.writing_entries TO authenticated, service_role;

CREATE POLICY "Authenticated users can read their own entries" ON app_journal.writing_entries
FOR SELECT TO authenticated
USING (owner_id = (SELECT auth.uid()));

CREATE POLICY "Authenticated users can insert their own entries" ON app_journal.writing_entries
FOR INSERT TO authenticated
WITH CHECK (owner_id = (SELECT auth.uid()));

CREATE POLICY "Authenticated users can update their own entries" ON app_journal.writing_entries
FOR UPDATE TO authenticated
USING (owner_id = (SELECT auth.uid()))
WITH CHECK (owner_id = (SELECT auth.uid()));

CREATE POLICY "Authenticated users can delete their own entries" ON app_journal.writing_entries
FOR DELETE TO authenticated
USING (owner_id = (SELECT auth.uid()));

--
-- Functions
--
CREATE OR REPLACE FUNCTION app_journal.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION app_journal.set_updated_at() FROM anon, authenticated;

CREATE OR REPLACE FUNCTION api_journal.get_last_writing_date()
RETURNS TIMESTAMPTZ
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT MAX(created_at)
  FROM app_journal.writing_entries
  WHERE owner_id = auth.uid()
$$;

REVOKE EXECUTE ON FUNCTION api_journal.get_last_writing_date() FROM anon;
GRANT EXECUTE ON FUNCTION api_journal.get_last_writing_date() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION api_journal.search_writing_entries(
  in_category api_journal.writing_category DEFAULT NULL,
  in_start_date TIMESTAMPTZ DEFAULT NULL,
  in_end_date TIMESTAMPTZ DEFAULT NULL,
  in_query TEXT DEFAULT NULL,
  in_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  category api_journal.writing_category,
  subject TEXT,
  body TEXT,
  rank DOUBLE PRECISION
)
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT
    e.id,
    e.created_at,
    e.updated_at,
    e.category,
    e.subject,
    e.body,
    CASE
      WHEN in_query IS NOT NULL AND in_query <> ''
      THEN ts_rank(e.search_vector, plainto_tsquery('english', in_query))
      ELSE NULL
    END AS rank
  FROM app_journal.writing_entries e
  WHERE e.owner_id = auth.uid()
    AND (in_category IS NULL OR e.category = in_category)
    AND (in_start_date IS NULL OR e.created_at >= in_start_date)
    AND (in_end_date IS NULL OR e.created_at <= in_end_date)
    AND (
      in_query IS NULL OR in_query = '' OR
      e.search_vector @@ plainto_tsquery('english', in_query)
    )
  ORDER BY rank DESC NULLS LAST, e.created_at DESC
  LIMIT 20 OFFSET in_offset
$$;

REVOKE EXECUTE ON FUNCTION api_journal.search_writing_entries(api_journal.writing_category, TIMESTAMPTZ, TIMESTAMPTZ, TEXT, INTEGER) FROM anon;
GRANT EXECUTE ON FUNCTION api_journal.search_writing_entries(api_journal.writing_category, TIMESTAMPTZ, TIMESTAMPTZ, TEXT, INTEGER) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION api_journal.get_writing_entry(in_id UUID)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  category api_journal.writing_category,
  subject TEXT,
  body TEXT
)
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT
    e.id,
    e.created_at,
    e.updated_at,
    e.category,
    e.subject,
    e.body
  FROM app_journal.writing_entries e
  WHERE e.id = in_id
    AND e.owner_id = auth.uid()
$$;

REVOKE EXECUTE ON FUNCTION api_journal.get_writing_entry(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION api_journal.get_writing_entry(UUID) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION api_journal.create_writing_entry(
  in_category api_journal.writing_category,
  in_subject TEXT,
  in_body TEXT
)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  category api_journal.writing_category,
  subject TEXT,
  body TEXT
)
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  INSERT INTO app_journal.writing_entries (category, subject, body)
  VALUES (in_category, in_subject, in_body)
  RETURNING id, created_at, updated_at, category, subject, body
$$;

REVOKE EXECUTE ON FUNCTION api_journal.create_writing_entry(api_journal.writing_category, TEXT, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION api_journal.create_writing_entry(api_journal.writing_category, TEXT, TEXT) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION api_journal.update_writing_entry(
  in_id UUID,
  in_category api_journal.writing_category DEFAULT NULL,
  in_subject TEXT DEFAULT NULL,
  in_body TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  category api_journal.writing_category,
  subject TEXT,
  body TEXT
)
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  UPDATE app_journal.writing_entries
  SET
    category = COALESCE(in_category, category),
    subject = COALESCE(in_subject, subject),
    body = COALESCE(in_body, body)
  WHERE id = in_id
    AND owner_id = auth.uid()
  RETURNING id, created_at, updated_at, category, subject, body
$$;

REVOKE EXECUTE ON FUNCTION api_journal.update_writing_entry(UUID, api_journal.writing_category, TEXT, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION api_journal.update_writing_entry(UUID, api_journal.writing_category, TEXT, TEXT) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION api_journal.delete_writing_entry(in_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  DELETE FROM app_journal.writing_entries
  WHERE id = in_id
    AND owner_id = auth.uid()
$$;

REVOKE EXECUTE ON FUNCTION api_journal.delete_writing_entry(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION api_journal.delete_writing_entry(UUID) TO authenticated, service_role;

--
-- Triggers
--
CREATE TRIGGER writing_entries_updated_at_trigger
BEFORE UPDATE ON app_journal.writing_entries
FOR EACH ROW
EXECUTE FUNCTION app_journal.set_updated_at();
