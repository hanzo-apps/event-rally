# event-rally — agent notes

Rally is a single-event RSVP page on the Hanzo stack, forked from the canonical
`hanzo-starter`. Vite + React 19 + `@hanzo/gui` (UI) + `@hanzo/iam` (auth) +
`@hanzo/base` (data). Keep it minimal and REAL — every surface must build and
run, no fabricated UI.

## The app

One event, one page. Guests see a color-flooded hero (date · title · place) with
a cream ticket-stub RSVP card; hosts sign in to manage it.

- **Event page** (`views/event.tsx`) — public landing: the flooded hero + the
  ticket stub. Signed out, the stub's CTA is a PKCE sign-in; signed in, it is the
  live RSVP form.
- **RSVP** (`views/rsvp.tsx`) — going / can't-make-it, a guest headcount, and a
  note → a row in the `rsvps` collection.
- **Attendees** (`views/attendees.tsx`) — host guest list with live counts
  (heads coming · replied yes · spots left).
- **Edit** (`views/edit.tsx`) — host creates/updates the single `event` row.
- **Host shell** (`views/host.tsx`) — the signed-in nav over those three.

## One way, decomplected

- **Providers** (`src/providers.tsx`) mount in the canonical order every Hanzo
  surface ships: `GuiProvider` → `IamProvider` → `BaseProvider`. `BaseProvider`
  gets a `BaseClient` carrying the IAM access token; it is rebuilt when the token
  changes (`src/lib/base.ts` `baseAs`). That single seam makes every
  `useQuery`/`useMutation` org-scoped to the signed-in user.
- **Env is one place** (`src/env.ts`), read from `import.meta.env.VITE_*`. The
  IAM client id is `VITE_IAM_CLIENT_ID` (a per-app client provisioned at deploy;
  falls back to the shared `hanzo-app`).
- **Look is one place** (`src/theme.ts`) — a single striking accent over ink,
  with a cream ticket. Raw hex is used on gui color props deliberately.
- **UI is one system** — `@hanzo/gui` primitives only (no second kit, no
  Tailwind).

## Gotchas (do not regress)

- **`@hanzo/gui` under Vite** needs three things in `vite.config.ts` (it is the
  Tamagui line; the in-browser builder runtime can't do this, which is the whole
  reason this ships as a real repo): (1) alias `react-native` →
  `react-native-web`, (2) `define` `process.env.TAMAGUI_TARGET` / `NODE_ENV` /
  `__DEV__`, (3) `dedupe` react/react-dom/react-native-web. No Tamagui compiler,
  no `one`, no Expo — the optimizer is a perf pass, not a correctness one.
- **`@hanzo/gui` props are Tamagui LONGHAND** with this v5 config:
  `alignItems`/`justifyContent`/`backgroundColor`/`padding`/`borderRadius`/
  `textAlign` — NOT the `items`/`justify`/`bg`/`p`/`rounded`/`text` shorthands.
  Shorthands pass at runtime but FAIL `tsc`.
- **A `Button`'s frame is a Stack.** It takes stack style props (backgroundColor,
  border*, height, flex, pressStyle) but NOT text props. Style the label on
  `Button.Text` (`color`/`fontSize`/`fontWeight`) — the `Cta` helper in
  `views/ui.tsx` wraps this once. `onPress` (not onClick); `Input` uses
  `value`/`onChangeText` and `inputMode` (not RN `keyboardType`); multiline text
  is `TextArea`, not `<Input multiline>`; `placeholderTextColor` takes a color
  token / CSS name, not raw hex.
- **PKCE storage is `localStorage`** (not sessionStorage) so the verifier/state
  survive the round-trip to hanzo.id.
- **`schema.sql` is the data contract.** It is the `databaseSchema` DDL the
  deploy translates into Base collections (`provisionBaseFromDDL`). Base manages
  `id`/`created`/`updated`/`owner`/`org` and enforces the org rule
  `@request.auth.org_id = org`; never re-declare those. Keep it in lockstep with
  `src/lib/event.ts` + `src/lib/rsvp.ts`.

## Deploy contract (Hanzo Cloud)

- Static SPA: `npm run build` → `dist/`, served at `<slug>.hanzo.app` from
  object storage (the `*.hanzo.app` published-sites edge). No server process.
- On publish, `schema.sql` → `provisionBaseFromDDL` creates the collections
  (org-scoped, IAM-native). Runtime read/write is browser → `VITE_HANZO_BASE_URL`
  with the IAM token.
- **IAM redirect registration** is the one external requirement: the IAM client
  (`VITE_IAM_CLIENT_ID`, default `hanzo-app`) must allow this origin's
  `/auth/callback`. Production needs a `https://*.hanzo.app/auth/callback`
  wildcard on the shared client (or a per-app `event-rally` client).

## Proven

`tsc --noEmit` clean · `vite build` → `dist/` · `login()` performs a real PKCE
S256 redirect to hanzo.id.

## Build

CI (`.github/workflows/ci.yml`) runs `npm ci && npm run typecheck && npm run
build` — build-verification only, NEVER a container image (Hanzo Cloud owns
deploys; do not build images locally).
