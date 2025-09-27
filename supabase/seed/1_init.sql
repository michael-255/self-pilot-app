-------------------------------------------------------------------------------
-- Create functions on the seeding schema to use in the other seeding scripts.
-- The seeding schema will be removed after the seeding is done.
-- Seeding will only run in local Supabase environments.
-------------------------------------------------------------------------------

--
-- Schema
--
CREATE SCHEMA IF NOT EXISTS seeding;

--
-- Seed User
--
CREATE OR REPLACE FUNCTION seeding.create_user(
  in_email TEXT,
  in_password TEXT,
  in_first_name TEXT,
  in_last_name TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Create auth user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    extensions.gen_random_uuid(),
    'authenticated',
    'authenticated',
    in_email,
    extensions.crypt(in_password, extensions.gen_salt('bf')),
    current_timestamp,
    current_timestamp,
    current_timestamp,
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('display_name', in_first_name || ' ' || in_last_name, 'email_verified', true),
    current_timestamp,
    current_timestamp,
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO new_user_id;

  -- Create auth identity
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    extensions.gen_random_uuid(),
    new_user_id,
    new_user_id,
    format('{"sub":"%s","email":"%s"}', new_user_id::text, in_email)::jsonb,
    'email',
    current_timestamp,
    current_timestamp,
    current_timestamp
  );

  RETURN new_user_id;
END;
$$;
