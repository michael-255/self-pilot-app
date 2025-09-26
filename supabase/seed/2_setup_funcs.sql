-------------------------------------------------------------------------------
-- Setup a seeding procedure with the data you want to seed.
-------------------------------------------------------------------------------

CREATE OR REPLACE PROCEDURE seeding.seed_database()
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  x_user_id UUID;
BEGIN
  x_user_id := seeding.create_user('a@a.com', 'testuser123', 'Test', 'User');
  -- TODO: Add more seeding logic here
END;
$$;
