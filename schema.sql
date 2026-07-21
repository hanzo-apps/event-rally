-- Hanzo Base schema for Rally (the `databaseSchema` DDL).
--
-- On publish, Hanzo Cloud translates each CREATE TABLE into a Hanzo Base
-- collection via `provisionBaseFromDDL` (additive + idempotent). Base manages
-- `id`/`created`/`updated`/`owner`/`org` itself, so they are never re-declared
-- here; every row is stamped with the verified IAM `owner`+`org` and is
-- org-scoped by the rule `@request.auth.org_id = org` — a member of your org
-- reads/writes it; other orgs cannot see it.
--
-- Keep this file in lockstep with what the app reads/writes
-- (src/lib/event.ts, src/lib/rsvp.ts, src/views/*).

-- The single event this page is about (most-recent row wins).
CREATE TABLE IF NOT EXISTS event (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  starts_at   TEXT NOT NULL DEFAULT '',
  location    TEXT NOT NULL DEFAULT '',
  capacity    INTEGER NOT NULL DEFAULT 0
);

-- One row per guest reply.
CREATE TABLE IF NOT EXISTS rsvps (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  name   TEXT NOT NULL,
  email  TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'yes',  -- 'yes' | 'no'
  guests INTEGER NOT NULL DEFAULT 0,   -- extra heads beyond the guest
  note   TEXT NOT NULL DEFAULT ''
);
