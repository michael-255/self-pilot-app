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
  a_user_id := seeding.create_user('a@a.com', 'selfpilot', 'Tester');
  b_user_id := seeding.create_user('b@b.com', 'selfpilot', '');

  -- Journal Seeding
  CALL seeding.create_writing_entry(a_user_id, now(), 'Journaling'::api_journal.writing_category, 'My first entry', 'This is my first journal entry.');
  CALL seeding.create_writing_entry(a_user_id, now() - INTERVAL '1 days', 'Journaling'::api_journal.writing_category, 'My second entry', 'This is my second journal entry.');
  CALL seeding.create_writing_entry(a_user_id, now() - INTERVAL '2 days', 'Creative'::api_journal.writing_category, 'A creative thought', 'Once upon a time...');
  CALL seeding.create_writing_entry(a_user_id, now() - INTERVAL '3 days', 'Creative'::api_journal.writing_category, 'Another idea', 'The quick brown fox jumps over the lazy dog.');
  CALL seeding.create_writing_entry(a_user_id, now() - INTERVAL '4 days', 'Journaling'::api_journal.writing_category, 'Reflections', 'Today I learned something new.');
  CALL seeding.create_writing_entry(a_user_id, now() - INTERVAL '5 days', 'Creative'::api_journal.writing_category, 'Inspiration', 'Creativity is intelligence having fun.');
  CALL seeding.create_writing_entry(a_user_id, now() - INTERVAL '6 days', 'Journaling'::api_journal.writing_category, 'Gratitude', 'I am grateful for the little things.');
  CALL seeding.create_writing_entry(a_user_id, now() - INTERVAL '7 days', 'Creative'::api_journal.writing_category, 'Dreams', 'Last night I dreamed of flying.');
  CALL seeding.create_writing_entry(a_user_id, now() - INTERVAL '8 days', 'Journaling'::api_journal.writing_category, 'Goals', 'My goal is to write daily.');
  CALL seeding.create_writing_entry(a_user_id, now() - INTERVAL '9 days', 'Creative'::api_journal.writing_category, 'Imagination', 'What if we could live on Mars?');
  CALL seeding.create_writing_entry(a_user_id, now() - INTERVAL '10 days', 'Weekly Review'::api_journal.writing_category, 'Mindfulness', 'Being present in the moment is key.');
  CALL seeding.create_writing_entry(a_user_id, now() - INTERVAL '11 days', 'Creative'::api_journal.writing_category, 'Storytelling', 'Every person has a unique story to tell.');
  CALL seeding.create_writing_entry(a_user_id, now() - INTERVAL '12 days', 'Journaling'::api_journal.writing_category, 'Challenges', 'Overcoming obstacles makes us stronger.');
  CALL seeding.create_writing_entry(a_user_id, now() - INTERVAL '13 days', 'Creative'::api_journal.writing_category, 'Adventure', 'Exploring new places is exciting.');
  CALL seeding.create_writing_entry(a_user_id, now() - INTERVAL '14 days', 'Journaling'::api_journal.writing_category, 'Happiness', 'Happiness is a choice we make daily.');
  CALL seeding.create_writing_entry(a_user_id, now() - INTERVAL '15 days', 'Creative'::api_journal.writing_category, 'Curiosity', 'Curiosity drives innovation and discovery.');
  CALL seeding.create_writing_entry(a_user_id, now() - INTERVAL '16 days', 'Goals & Planning'::api_journal.writing_category, 'Learning', 'Every day is an opportunity to learn something new.');
  CALL seeding.create_writing_entry(a_user_id, now() - INTERVAL '17 days', 'Creative'::api_journal.writing_category, 'Creativity', 'Creativity is the power to connect the seemingly unconnected.');
  CALL seeding.create_writing_entry(a_user_id, now() - INTERVAL '18 days', 'Other'::api_journal.writing_category, 'Wellness', 'Taking care of my mind and body is essential.');
  CALL seeding.create_writing_entry(a_user_id, now() - INTERVAL '19 days', 'Creative'::api_journal.writing_category, 'Innovation', 'Innovation starts with a single idea.');
END;
$$;
