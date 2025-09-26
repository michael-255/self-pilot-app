--
-- Schemas
--

CREATE SCHEMA IF NOT EXISTS api_test;

CREATE TABLE IF NOT EXISTS api_test.ids (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY
);
