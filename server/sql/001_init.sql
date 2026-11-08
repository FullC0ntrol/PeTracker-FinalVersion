-- Schemat bazy PetTrace (PostgreSQL 13+).

CREATE TABLE users (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text NOT NULL UNIQUE,
  name       text NOT NULL DEFAULT '',
  phone      text NOT NULL DEFAULT '',
  pin_hash   text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE pets (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  name          text NOT NULL CHECK (length(trim(name)) > 0),
  species       text NOT NULL DEFAULT 'dog' CHECK (species IN ('dog', 'cat', 'other')),
  breed         text NOT NULL DEFAULT '',
  birth_date    date,
  weight_kg     numeric(5, 2) CHECK (weight_kg > 0),
  medical_notes text NOT NULL DEFAULT '',
  is_lost       boolean NOT NULL DEFAULT false,
  lost_message  text NOT NULL DEFAULT '',
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX pets_owner_id_idx ON pets (owner_id);

CREATE TABLE tags (
  code       text PRIMARY KEY CHECK (code ~ '^[A-Z0-9]{4}-[A-Z0-9]{4}$'),
  pet_id     uuid REFERENCES pets (id) ON DELETE SET NULL,
  is_active  boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
); 


CREATE UNIQUE INDEX tags_one_active_per_pet ON tags (pet_id) WHERE is_active;


CREATE TABLE tag_scans (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_code   text NOT NULL REFERENCES tags (code) ON DELETE CASCADE,
  scanned_at timestamptz NOT NULL DEFAULT now(),
  user_agent text NOT NULL DEFAULT '',
  by_owner   boolean NOT NULL DEFAULT false
);

CREATE INDEX tag_scans_tag_code_scanned_at_idx ON tag_scans (tag_code, scanned_at DESC);


CREATE TABLE activities (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id       uuid NOT NULL REFERENCES pets (id) ON DELETE CASCADE,
  type         text NOT NULL CHECK (type IN ('feeding', 'walk')),
  occurred_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX activities_pet_id_occurred_at_idx ON activities (pet_id, occurred_at DESC);
