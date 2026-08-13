## Why

The frontend's header is still scaffold placeholder: a white bar with a plain
`LearnMap` text link, two undecorated nav links, and the literal text `Account`
where the user menu belongs — a `<div aria-hidden>` that does nothing when clicked.
EP-000 App Shell & Navigation specifies a logo that links to the dashboard, a
highlighted active section, an avatar menu carrying the user's display name,
Profile & Settings, and Sign out, and nav links that collapse into a hamburger on
mobile. The approved prototype (`prototype/src/components/nav/`) demonstrates all of
it.

This is the highest-visibility gap between the shipped app and the approved design:
the header renders on every authenticated page, so every page currently looks
unfinished, and there is no way to sign out from the UI at all (FR-AUTH-006). Fixing
it now means later pages inherit a correct shell instead of being built around a
placeholder.

## What Changes

- Replace the placeholder top nav with the prototype's header: a sticky, dark,
  blurred bar containing a logo mark (map glyph on a primary-coloured tile) that links
  to `/dashboard`, and `Dashboard` / `Browse Roadmaps` links.
- Highlight the current section as a filled pill, driven by the router rather than by
  page-level props.
- Collapse the nav links below the `md` breakpoint behind a hamburger toggle that
  expands them underneath the bar and closes itself on navigation.
- Replace the static `Account` text with a real user avatar menu: display name, email,
  `Profile & Settings`, and `Sign out`.
- Show a `Sign in` button linking to `/login` when there is no session, so the header
  is coherent while authentication remains unimplemented.
- Read the user from `GET /users/me` and sign out via `POST /auth/logout` — the
  endpoints already specified in `architecture/api-design.md`. Neither exists in the
  backend yet; see Impact.
- Add the `avatar` and `dropdown-menu` shadcn primitives the menu needs, matching the
  generation of the frontend's existing `button`.

Deliberate deviations from the prototype, each recorded in design.md: the prototype's
`Dark mode` menu item is dropped, `Profile & Settings` renders disabled, and the avatar
initials fallback uses the brand colour rather than `muted`.

Explicitly **not** in this change: the breadcrumb below the header (FR-SHELL-005), the
route-transition loading indicator (NFR-SHELL-002), the 404 page (FR-SHELL-007), the
`RequireAuth` / `RequireOnboarded` route guards, and the Profile & Settings page itself
(out of scope per EP-000).

## Capabilities

### New Capabilities

- `app-shell-header`: The persistent top navigation bar shared by every authenticated
  page — what it contains, how the active section is indicated, how it behaves at
  mobile widths, what the user menu offers in signed-in and signed-out states, and what
  signing out does.

### Modified Capabilities

_None. `openspec/specs/` contains no capabilities yet, so there are no existing
requirements to revise. EP-000 and EP-001 under `requirements/` are the product-level
epics this capability derives from, not OpenSpec specs._

## Impact

**Modified files in `learnmap-cursor/frontend`**

- `src/components/nav/TopNav.tsx` — rewritten from the placeholder.
- `src/components/nav/UserMenu.tsx` — replaces the `Account` stub with the avatar menu.
- `src/hooks/useAuth.ts` — types the `/users/me` query with a `User` type, unwraps the
  `{ data }` envelope to match the other hooks, and adds a sign-out mutation.

**New files in `learnmap-cursor/frontend`**

- `src/components/ui/avatar.tsx`, `src/components/ui/dropdown-menu.tsx` — vendored
  shadcn primitives.
- `src/types/user.ts` — mirrors the `User` fields in `architecture/data-model.md`.
- `src/components/nav/TopNav.test.tsx` — the header's first tests.

**No impact on** the backend, the Prisma schema, the API surface, routing, or any other
page. No new npm dependencies: `radix-ui` and `lucide-react` are already installed.

**External dependency — authentication.** `GET /users/me` and `POST /auth/logout` are
specified in `architecture/api-design.md` but not implemented; the backend has no `User`
model. The header is therefore built to degrade honestly: no session means a `Sign in`
button instead of an avatar, and the signed-in states are verifiable only against a
stub. The avatar menu needs no change when EP-001 lands.

**Ordering note.** These artifacts were written after the implementation, which is on
`learnmap-cursor/frontend` PR #9 (branch
`cursor/update-header-to-match-prototype-1d8c`). They document and specify the
delivered behaviour rather than having preceded it.
