-------------------------------------------------------------------------------
-- Setup a seeding procedure with the data you want to seed.
-------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE seeding.seed_database()
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  a_user_id UUID;
  b_user_id UUID;
BEGIN
  a_user_id := seeding.create_user('a@a.com', 'selfpilot', 'Tester-A');
  b_user_id := seeding.create_user('b@b.com', 'selfpilot', 'Tester-B');
  -- TODO: Add more seeding logic here
END;
$$;
