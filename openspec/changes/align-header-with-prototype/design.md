## Context

See proposal.md — Why. What shapes the approach is that the design already exists as
working code: `prototype/src/components/nav/TopNav.tsx` and `UserMenu.tsx` are the
approved header, and the frontend already runs the same stack (React Router, Tailwind v4,
shadcn/ui on the unified `radix-ui` package, `lucide-react`). So the question is not how
to design a header; it is how much of the prototype to take literally, and what to do
about the parts of it that lean on prototype-only scaffolding.

Three constraints matter:

**The prototype's header is backed by a mock store.** Its `UserMenu` reads the user from
an in-memory `useStore()`, toggles a `next-themes` provider, and raises a toast that says
Profile & Settings is out of scope. The frontend has none of that: no store, no theme
provider, no toast library. Every one of those touch points needs a decision, not a copy.

**Authentication does not exist yet.** `GET /users/me` and `POST /auth/logout` are
specified in `architecture/api-design.md`, but the backend exposes only `/`, `/health`,
and `/roadmaps`, and `prisma/schema.prisma` has no `User` model. The frontend's
`useAuth()` hook already calls `/users/me`, so the header can be wired to the real
contract, but its signed-in states cannot be exercised against the real backend.

**The frontend has three ui primitives.** `button`, `badge`, `card` — no `avatar`, no
`dropdown-menu`. Both are needed, and both exist in the prototype at the same shadcn
generation as the frontend's `button` (same `data-slot` conventions, same unified
`radix-ui` import style).

## Goals / Non-Goals

**Goals:**

- Visual and behavioural parity with the prototype at the pixel level where the prototype
  is expressing design intent, so the two can be compared side by side.
- Every deviation is deliberate and written down, rather than an accident of porting.
- The header works today, with no session and no auth endpoints, and needs no rework when
  EP-001 lands — only the endpoints becoming real.
- Active-section state has exactly one source of truth: the router.

**Non-Goals:**

- Introducing a client-side store, a theme provider, or a toast library to satisfy the
  prototype's dependencies. Each would be a product decision smuggled in as a port.
- Refactoring the app shell around the header (breadcrumb slot, content max-width,
  route guards). The header is replaced in place.
- Making the vendored shadcn primitives project-specific. They stay as generated so a
  future `shadcn` update is a clean diff.

## Decisions

### D1: Port the prototype's header markup verbatim, including its locally scoped dark theme

The prototype scopes the dark palette to the header element itself rather than theming the
app. That is a design choice, not an artifact — the header is a dark bar above light
content — so it is preserved exactly.

*Consequence worth naming.* Menus opened from the header render in a portal on
`document.body`, outside that scope, so the user menu is light while the bar is dark. The
prototype behaves identically, and the comparison screenshot confirms it. This is intended,
not a bug to fix.

*Alternative rejected.* Re-deriving the styling from the design tokens would drift from the
prototype for no benefit; the prototype is the reference.

### D2: Drop the prototype's `Dark mode` menu item

The item toggles a `next-themes` provider that the frontend does not have, and no
requirement asks for a theme switch — EP-000 FR-SHELL-004 lists the display name, Profile
& Settings, and Sign out, and nothing else.

*Alternative rejected.* Adding `next-themes` and a provider to keep the item would ship an
unrequested feature, and a half-working one: nothing else in the app has been checked
against a light/dark switch.

### D3: `Profile & Settings` is present but disabled

The prototype pops a toast explaining the page is out of scope. The frontend has no toast
library, and EP-000 puts the page's content out of scope while FR-SHELL-004 still requires
the entry.

Disabling it satisfies both without inventing a destination: the entry is visible, so the
menu matches the spec, and it cannot navigate to a route that does not exist.

*Alternatives rejected.* Linking to `/settings` would fall through to the 404 route.
Omitting it would violate FR-SHELL-004. Adding a toast library for one message is
disproportionate.

### D4: With no session, show a `Sign in` affordance rather than nothing

The prototype's `UserMenu` renders `null` when there is no user, because in the prototype
you cannot reach the shell unsigned. The frontend has no route guards yet, so the shell is
reachable with no session — and rendering nothing leaves a conspicuously empty header
corner with no way to sign in.

*Consequence.* Once `RequireAuth` lands, this state becomes mostly unreachable, and the
fallback becomes dead weight in the common path. It stays as the honest representation of
"no session" rather than a temporary hack: a session can expire mid-visit (FR-AUTH-007).

### D5: Wire to the specified endpoints, not to a local mock

`useAuth()` keeps calling `GET /users/me` and now unwraps the `{ data }` envelope that
every other hook in the repo unwraps, typed by a new `User` mirroring
`architecture/data-model.md` (`id`, `email`, `displayName`, optional `avatarUrl`). Sign-out
posts to `/auth/logout`.

*Rationale.* The contract is already specified and the hook already existed; pointing the
header at a temporary fake would mean rewriting it when EP-001 lands, and would hide the
fact that the endpoints are missing. Today the query simply fails and the header shows
`Sign in` — a truthful rendering of the current system.

*Risk accepted.* The `{ data: … }` envelope for `/users/me` is inferred from the roadmap
endpoints, not from a written response schema. If EP-001 returns a bare object, exactly one
line changes, because unwrapping happens in one place.

### D6: Sign-out discards cached data regardless of the request's outcome

The mutation clears the query cache on settle — success or failure — and the component
navigates to `/login` afterwards.

*Rationale.* The failure mode to avoid is a user who clicked `Sign out`, saw an error, and
is still looking at their own data. Leaving the authenticated area is the safe outcome even
when the server call fails; the cookie may still be valid, but nothing of the previous
user's remains on screen.

*Placement.* Navigation stays in the component rather than the hook, so the hook has no
router dependency and stays usable from anywhere.

### D7: Brand-colour the avatar initials fallback instead of shadcn's `muted`

The generated `AvatarFallback` uses `bg-muted` / `text-muted-foreground`. Against the dark
header those land within a few percent lightness of the bar itself; in a full-resolution
screenshot the circle is effectively invisible and the initials are barely legible. The
fallback is also the *common* case, since no avatar URLs exist until OAuth supplies them.

Overriding to the primary colour makes it read as an intentional avatar and matches the
logo tile. The prototype does not hit this because its mock user has a picture.

*Scope of the override.* Applied at the call site, not in the vendored component, so
`avatar.tsx` stays a clean generated file (see D9).

### D8: Mobile links expand under the bar; no drawer

The prototype ships a `sheet` primitive but its header does not use it — the toggle reveals
a stacked list directly beneath the bar, pushing content down. Same approach here, which
avoids vendoring a third primitive and keeps the collapsed markup in the same component as
the expanded one.

### D9: Vendor `avatar` and `dropdown-menu` from the prototype, unmodified except for `"use client"`

Copied rather than re-generated so both repos stay on the same shadcn generation. The only
edit is deleting the `"use client"` directive from `dropdown-menu.tsx`: it is a Next.js
marker, meaningless in Vite, and absent from the frontend's existing `button.tsx`.

*Consequence.* Both files export more than the header uses (`AvatarGroup`,
`DropdownMenuRadioGroup`, submenus). That is normal for vendored ui primitives, and ESLint
already exempts `src/components/ui/**` from `react-refresh/only-export-components`.

### D10: Active state comes from the router, never from page props

The section links derive their highlight from the current location, which also yields the
`aria-current="page"` the accessibility requirement needs for free. No page passes an
"active tab" prop, so the highlight cannot disagree with the rendered page.

### D11: Accessibility additions the prototype lacks

The collapse toggle gains an expanded/collapsed state and a reference to the region it
controls, and each nav grouping keeps a distinct accessible name so the inline and mobile
sets are distinguishable. These are additive and required by NFR-SHELL-003, which the
prototype was never held to.

### D12: Verify signed-in states against a throwaway stub, not committed fakes

Component tests cover the header's logic with the api module mocked. For the manual
walkthrough, the two missing endpoints are served by a scratch process outside the repo,
with the dev server pointed at it through the existing `VITE_API_URL` escape hatch.

*Rationale.* No repo file changes to demo the signed-in header, and nothing to remove
later. The alternative — a committed mock user or an MSW layer — would have to be found and
deleted when EP-001 lands.

## Risks / Trade-offs

- **The header's dark palette is hardcoded, so a future app-wide theme toggle will not
  reach it** → Mitigation: it is one scoped class in one component; whoever introduces
  theming decides then whether the bar follows the theme or stays dark by design. Recorded
  as an open question rather than pre-solved.
- **`GET /users/me` fails on every page load until EP-001 lands**, producing a 404/401 in
  the console that could be mistaken for a regression → Mitigation: the query does not
  retry, the failure is handled as "no session", and this note is the record of why it is
  expected.
- **A disabled `Profile & Settings` can read as a bug** to a user who does not know the
  page is unbuilt → Mitigation: it is visibly unavailable rather than silently inert, and
  it becomes a link the moment a destination exists.
- **Sign-out clears the entire query cache**, including data that is not user-specific such
  as the roadmap catalog → Mitigation: correctness over cache warmth; the catalog is one
  cheap request on the next visit, and enumerating "safe" keys would be a maintenance trap.
- **The `{ data }` envelope for `/users/me` is an inference** → Mitigation: single unwrap
  point (D5); EP-001 should confirm the envelope when it implements the endpoint.
- **The vendored primitives duplicate what a future `shadcn` update would regenerate** →
  Mitigation: kept byte-identical to the prototype's copies so a regeneration diff shows
  only real changes.

## Migration Plan

Purely additive UI work: no data migration, no API change, no deployment step beyond the
normal frontend build.

1. Vendor the two ui primitives, then replace the header components and extend the auth
   hook.
2. Verify with component tests, then manually at desktop and phone widths, using the stub
   from D12 for the signed-in states and the running prototype as the visual reference.
3. Merge. The visible result is immediate on every authenticated page.

**Rollback.** Revert the commits; nothing else depends on the new primitives or the `User`
type. The previous header was a placeholder, so reverting loses nothing but the placeholder
itself.

**When EP-001 lands**, no header change should be required: `/users/me` starts returning a
user, the avatar and menu light up, and `Sign out` starts clearing a real cookie. The
`Sign in` fallback stays as the session-expired presentation.

## Open Questions

- **Should the header follow an app-wide theme once one exists**, or stay permanently dark
  as the prototype specifies? (See D1.) Deferrable: it changes one class, not the structure.
- **Should `Profile & Settings` become a link to a stub page** when EP-001 lands, before the
  real page exists? (See D3.)
- **Where does the breadcrumb (FR-SHELL-005) live** relative to the header — inside the
  header component, or a sibling in the shell as it is today? Its own change; noted here
  only because it will touch the shell directly below this header.
- **Should the route-transition loading indicator (NFR-SHELL-002) be hosted by the
  header** as a progress bar along its bottom edge? The header is the natural host, but the
  requirement belongs to a separate change.
