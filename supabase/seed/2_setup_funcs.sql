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
  category_id_1 INTEGER;
  category_id_2 INTEGER;
BEGIN
  a_user_id := seeding.create_user('a@a.com', 'selfpilot', 'Tester');
  b_user_id := seeding.create_user('b@b.com', 'selfpilot', '');

  SELECT id INTO category_id_1 FROM app_journal.writing_categories WHERE slug = 'journaling' LIMIT 1;
  SELECT id INTO category_id_2 FROM app_journal.writing_categories WHERE slug = 'creative' LIMIT 1;

  -- Journal Seeding
  CALL seeding.create_writing_entry(a_user_id, category_id_1, 'My first entry', 'This is my first journal entry.');
  CALL seeding.create_writing_entry(a_user_id, category_id_1, 'My second entry', 'This is my second journal entry.');
  CALL seeding.create_writing_entry(a_user_id, category_id_2, 'A creative thought', 'Once upon a time...');
  CALL seeding.create_writing_entry(a_user_id, category_id_2, 'Another idea', 'The quick brown fox jumps over the lazy dog.');
  CALL seeding.create_writing_entry(a_user_id, category_id_1, 'Reflections', 'Today I learned something new.');
  CALL seeding.create_writing_entry(a_user_id, category_id_2, 'Inspiration', 'Creativity is intelligence having fun.');
  CALL seeding.create_writing_entry(a_user_id, category_id_1, 'Gratitude', 'I am grateful for the little things.');
  CALL seeding.create_writing_entry(a_user_id, category_id_2, 'Dreams', 'Last night I dreamed of flying.');
  CALL seeding.create_writing_entry(a_user_id, category_id_1, 'Goals', 'My goal is to write daily.');
  CALL seeding.create_writing_entry(a_user_id, category_id_2, 'Imagination', 'What if we could live on Mars?');
  CALL seeding.create_writing_entry(a_user_id, category_id_1, 'Mindfulness', 'Being present in the moment is key.');
  CALL seeding.create_writing_entry(a_user_id, category_id_2, 'Storytelling', 'Every person has a unique story to tell.');
  CALL seeding.create_writing_entry(a_user_id, category_id_1, 'Challenges', 'Overcoming obstacles makes us stronger.');
  CALL seeding.create_writing_entry(a_user_id, category_id_2, 'Adventure', 'Exploring new places is exciting.');
  CALL seeding.create_writing_entry(a_user_id, category_id_1, 'Happiness', 'Happiness is a choice we make daily.');
  CALL seeding.create_writing_entry(a_user_id, category_id_2, 'Curiosity', 'Curiosity drives innovation and discovery.');
  CALL seeding.create_writing_entry(a_user_id, category_id_1, 'Learning', 'Every day is an opportunity to learn something new.');
  CALL seeding.create_writing_entry(a_user_id, category_id_2, 'Creativity', 'Creativity is the power to connect the seemingly unconnected.');
  CALL seeding.create_writing_entry(a_user_id, category_id_1, 'Wellness', 'Taking care of my mind and body is essential.');
  CALL seeding.create_writing_entry(a_user_id, category_id_2, 'Innovation', 'Innovation starts with a single idea.');
END;
$$;
