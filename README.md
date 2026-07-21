# Rally — Event RSVP Page

One event. One page. One tap to RSVP.

Rally is a real, buildable app on the Hanzo stack — a single-event page with RSVP
capture. Guests see the event and reply yes/no with a headcount; the host manages
the details and watches the guest list fill in. Fork it on
[hanzo.app](https://hanzo.app) and deploy live on Hanzo Cloud.

- **UI** — [`@hanzo/gui`](https://www.npmjs.com/package/@hanzo/gui) (the Hanzo
  design system) under Vite + React 19. 100% gui primitives — no Tailwind, no
  second kit.
- **Auth** — [`@hanzo/iam`](https://www.npmjs.com/package/@hanzo/iam), OAuth2
  **PKCE** against [hanzo.id](https://hanzo.id). No local passwords.
- **Data** — [`@hanzo/base`](https://www.npmjs.com/package/@hanzo/base), the
  IAM-native, org-scoped data plane. The event and every RSVP are real Base rows.

## The three views

- **Event page** — a color-flooded hero (date · title · place) with a cream
  ticket-stub RSVP card. Public: the CTA is a one-tap Hanzo sign-in. Signed in:
  the live RSVP form (going / can't-make-it · guest headcount · note).
- **Attendees** — the host's guest list with live counts: heads coming, replied
  yes, spots left.
- **Edit** — the host creates and updates the single event (title, description,
  date/time, location, capacity).

The event page is public by design — the invite is the landing, and sign-in is
what unlocks RSVP + management.

## Stack (pinned)

| Package | Version |
| --- | --- |
| `react` / `react-dom` | `^19.2.4` |
| `@hanzo/gui` + `@hanzogui/config` | `7.3.0` |
| `@hanzo/iam` | `^0.13.1` |
| `@hanzo/base` | `^0.2.1` |
| `vite` | `^6` (`@vitejs/plugin-react`) |
| `typescript` | `5.9.3` |

## Run it

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc --noEmit && vite build  ->  dist/
npm run preview    # serve the production build (SPA fallback on)
```

Out of the box it runs against **live** Hanzo (hanzo.id + api.hanzo.ai) — no
config needed to see the invite and the sign-in flow. Copy `.env.example` to
`.env` to point at a different environment.

## Environment contract

Only `VITE_`-prefixed vars reach the browser (this is a static SPA — no server).
Defaults in parentheses.

| Var | Purpose |
| --- | --- |
| `VITE_HANZO_IAM_URL` (`https://hanzo.id`) | OIDC issuer. |
| `VITE_IAM_CLIENT_ID` (`hanzo-app`) | IAM application (`<org>-<app>`). A dedicated `event-rally` client is provisioned at deploy; its redirect-URI list must allow this deploy's `/auth/callback`. |
| `VITE_HANZO_REDIRECT_URI` (`${origin}/auth/callback`) | PKCE redirect. |
| `VITE_HANZO_BASE_URL` (`https://api.hanzo.ai`) | Browser-reachable Hanzo Base data plane. Deploy injects the provisioned URL. |

## How auth works — ambient IAM

`login()` starts an OAuth2 **PKCE S256** redirect to hanzo.id; hanzo.id returns
to `/auth/callback`, where `handleCallback()` exchanges the code for tokens
(stored in `localStorage`, refresh-aware via `offline_access`). Every deployed
app is a static site at `<slug>.hanzo.app`; there is **no server token** — the
SPA authenticates the user in the browser and carries the resulting IAM JWT to
Base.

The one deploy requirement: the IAM client (`VITE_IAM_CLIENT_ID`) must list this
origin's `/auth/callback` as an allowed redirect URI.

## How data works — Base from `schema.sql`

[`schema.sql`](./schema.sql) is the app's `databaseSchema` (SQL DDL): the `event`
and `rsvps` collections. On publish, Hanzo Cloud translates each `CREATE TABLE`
into a Hanzo Base collection (`provisionBaseFromDDL`, additive + idempotent).
Base manages `id`/`created`/`updated`/`owner`/`org`, stamps `owner`+`org` from
the verified IAM principal, and scopes every row to the caller's org by the rule
`@request.auth.org_id = org` — a teammate in your org sees the row; other orgs
cannot. Runtime read/write is `@hanzo/base/react` (`useQuery`/`useMutation`)
carrying the IAM token.

## Deploy — Hanzo Cloud

[`hanzo.yml`](./hanzo.yml) declares a static build (`npm run build` → `dist/`,
served at `<slug>.hanzo.app`) plus the Base schema to provision and the env to
inject. Do **not** build a container image locally — Hanzo Cloud owns builds and
deploys. CI here only proves the template compiles green.

## Layout

```
src/
  main.tsx          entry
  providers.tsx     GuiProvider -> IamProvider -> BaseProvider(client=IAM-token)
  app.tsx           route (/auth/callback) + auth gate (public event ↔ host shell)
  theme.ts          the one accent palette
  env.ts            the VITE_ env contract, one place
  gui.config.ts     createGui(defaultConfig from @hanzogui/config/v5)
  iam.config.ts     IAM PKCE config
  lib/base.ts       BaseClient carrying the IAM bearer token
  lib/event.ts      event row + sample + date formatting
  lib/rsvp.ts       rsvp row + headcount tally
  auth/callback.tsx PKCE return leg
  views/            event · rsvp · attendees · edit · host · ui (Field/Pill/Stepper/Cta)
schema.sql          databaseSchema (event · rsvps) -> Base collections on publish
hanzo.yml           Hanzo Cloud build/deploy manifest
```
