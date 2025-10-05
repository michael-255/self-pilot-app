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
  LIMIT 1
$$;

REVOKE EXECUTE ON FUNCTION api_journal.get_writing_entry(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION api_journal.get_writing_entry(UUID) TO authenticated, service_role;
