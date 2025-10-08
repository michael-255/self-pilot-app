-------------------------------------------------------------------------------
--
-- Schemas
--
-------------------------------------------------------------------------------
-- API Writing
CREATE SCHEMA IF NOT EXISTS api_writing AUTHORIZATION postgres;
GRANT USAGE ON SCHEMA api_writing TO authenticated, service_role;

-- Private Writing
CREATE SCHEMA IF NOT EXISTS private_writing AUTHORIZATION postgres;
GRANT USAGE ON SCHEMA private_writing TO authenticated, service_role;

-- Private Shared
CREATE SCHEMA IF NOT EXISTS private_shared AUTHORIZATION postgres;
GRANT USAGE ON SCHEMA private_shared TO authenticated, service_role;

-------------------------------------------------------------------------------
--
-- Enums
--
-------------------------------------------------------------------------------
CREATE TYPE api_writing.category AS ENUM (
  -- Any Category
  'Journaling',
  'Weekly Review',
  'Yearly Review',
  'Goals & Planning',
  'Brainstorming',
  'Creative',
  'Other'
);

-------------------------------------------------------------------------------
--
-- Tables
--
-------------------------------------------------------------------------------
CREATE TABLE private_writing.entries (
  id UUID PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  owner_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  category api_writing.category NOT NULL,
  subject TEXT NOT NULL CHECK (char_length(subject) <= 100),
  body TEXT NOT NULL CHECK (char_length(body) <= 50000),
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', COALESCE(subject, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(body, '')), 'B')
  ) STORED
);

CREATE INDEX IF NOT EXISTS entries_search_vector_idx
  ON private_writing.entries USING GIN (search_vector);

ALTER TABLE private_writing.entries ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON private_writing.entries TO authenticated, service_role;

CREATE POLICY "Authenticated users can read their own entries" ON private_writing.entries
FOR SELECT TO authenticated
USING (owner_id = (SELECT auth.uid()));

CREATE POLICY "Authenticated users can insert their own entries" ON private_writing.entries
FOR INSERT TO authenticated
WITH CHECK (owner_id = (SELECT auth.uid()));

CREATE POLICY "Authenticated users can update their own entries" ON private_writing.entries
FOR UPDATE TO authenticated
USING (owner_id = (SELECT auth.uid()))
WITH CHECK (owner_id = (SELECT auth.uid()));

CREATE POLICY "Authenticated users can delete their own entries" ON private_writing.entries
FOR DELETE TO authenticated
USING (owner_id = (SELECT auth.uid()));

-------------------------------------------------------------------------------
--
-- Functions
--
-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION private_shared.set_updated_at()
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

REVOKE EXECUTE ON FUNCTION private_shared.set_updated_at() FROM anon, authenticated;

CREATE OR REPLACE FUNCTION api_writing.get_last_entry()
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  category api_writing.category,
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
  FROM private_writing.entries e
  WHERE e.owner_id = auth.uid()
  ORDER BY e.created_at DESC
  LIMIT 1
$$;

REVOKE EXECUTE ON FUNCTION api_writing.get_last_entry() FROM anon;
GRANT EXECUTE ON FUNCTION api_writing.get_last_entry() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION api_writing.search_entries(
  in_category api_writing.category DEFAULT NULL,
  in_start_date TIMESTAMPTZ DEFAULT NULL,
  in_end_date TIMESTAMPTZ DEFAULT NULL,
  in_query TEXT DEFAULT NULL,
  in_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  category api_writing.category,
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
  FROM private_writing.entries e
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

REVOKE EXECUTE ON FUNCTION api_writing.search_entries(api_writing.category, TIMESTAMPTZ, TIMESTAMPTZ, TEXT, INTEGER) FROM anon;
GRANT EXECUTE ON FUNCTION api_writing.search_entries(api_writing.category, TIMESTAMPTZ, TIMESTAMPTZ, TEXT, INTEGER) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION api_writing.get_entry(in_id UUID)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  category api_writing.category,
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
  FROM private_writing.entries e
  WHERE e.id = in_id
    AND e.owner_id = auth.uid()
  LIMIT 1
$$;

REVOKE EXECUTE ON FUNCTION api_writing.get_entry(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION api_writing.get_entry(UUID) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION api_writing.create_entry(
  in_category api_writing.category,
  in_subject TEXT,
  in_body TEXT
)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  category api_writing.category,
  subject TEXT,
  body TEXT
)
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  INSERT INTO private_writing.entries (category, subject, body)
  VALUES (in_category, in_subject, in_body)
  RETURNING id, created_at, updated_at, category, subject, body
$$;

REVOKE EXECUTE ON FUNCTION api_writing.create_entry(api_writing.category, TEXT, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION api_writing.create_entry(api_writing.category, TEXT, TEXT) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION api_writing.update_entry(
  in_id UUID,
  in_category api_writing.category DEFAULT NULL,
  in_subject TEXT DEFAULT NULL,
  in_body TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  category api_writing.category,
  subject TEXT,
  body TEXT
)
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  UPDATE private_writing.entries
  SET
    category = COALESCE(in_category, category),
    subject = COALESCE(in_subject, subject),
    body = COALESCE(in_body, body)
  WHERE id = in_id
    AND owner_id = auth.uid()
  RETURNING id, created_at, updated_at, category, subject, body
$$;

REVOKE EXECUTE ON FUNCTION api_writing.update_entry(UUID, api_writing.category, TEXT, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION api_writing.update_entry(UUID, api_writing.category, TEXT, TEXT) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION api_writing.delete_entry(in_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  DELETE FROM private_writing.entries
  WHERE id = in_id
    AND owner_id = auth.uid()
$$;

REVOKE EXECUTE ON FUNCTION api_writing.delete_entry(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION api_writing.delete_entry(UUID) TO authenticated, service_role;

-------------------------------------------------------------------------------
--
-- Triggers
--
-------------------------------------------------------------------------------
CREATE TRIGGER entries_updated_at_trigger
BEFORE UPDATE ON private_writing.entries
FOR EACH ROW
EXECUTE FUNCTION private_shared.set_updated_at();
