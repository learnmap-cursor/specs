All file paths are relative to the `learnmap-cursor/frontend` repository. Groups 1-7 are
complete on branch `cursor/update-header-to-match-prototype-1d8c` (PR #9); group 8 is
follow-up work that belongs to other changes.

## 1. Vendor the missing ui primitives

- [x] 1.1 Copy `avatar.tsx` and `dropdown-menu.tsx` from
      `specs/prototype/src/components/ui/` into `src/components/ui/`, unmodified, so both
      repos stay on one shadcn generation (design D9).
- [x] 1.2 Delete the `"use client"` directive from `dropdown-menu.tsx` — a Next.js marker
      with no meaning in Vite, and absent from the existing `button.tsx`.
- [x] 1.3 Confirm no new dependency is needed: both primitives import from the already
      installed unified `radix-ui` package and `lucide-react`.

## 2. Extend the auth data layer

- [x] 2.1 Add `src/types/user.ts` with the `User` fields from
      `architecture/data-model.md` (`id`, `email`, `displayName`, optional `avatarUrl`).
- [x] 2.2 Type the existing `useAuth()` query with `User` and unwrap the `{ data }`
      envelope, matching `useRoadmaps`. Keep `retry: false` so a missing session fails fast.
- [x] 2.3 Add a sign-out mutation posting `/auth/logout` that clears the query cache on
      settle — success or failure (design D6). Leave navigation to the caller.

## 3. Rebuild the top navigation bar

- [x] 3.1 Replace `src/components/nav/TopNav.tsx` with the prototype's header: sticky,
      blurred, locally scoped dark palette, `max-w-6xl` inner container (design D1).
- [x] 3.2 Add the logo mark — map glyph on a primary-coloured tile beside the wordmark —
      linking to `/dashboard`, not `/`.
- [x] 3.3 Render the `Dashboard` and `Browse Roadmaps` links with the active section as a
      filled pill, derived from the router so `aria-current="page"` comes for free
      (design D10).
- [x] 3.4 Hide the inline links below `md` and add the toggle that expands them beneath the
      bar, collapsing on navigation (design D8).
- [x] 3.5 Give the toggle an accessible name that reflects its action, plus expanded state
      and a reference to the region it controls; give each nav grouping a distinct
      accessible name (design D11).

## 4. Rebuild the user menu

- [x] 4.1 Replace the `Account` text stub in `src/components/nav/UserMenu.tsx` with the
      avatar dropdown: display name and email, `Profile & Settings`, `Sign out`.
- [x] 4.2 Render the profile picture when present and initials — at most two, from the
      display name — when not.
- [x] 4.3 Brand-colour the initials fallback at the call site so it is legible against the
      dark bar, leaving the vendored `avatar.tsx` untouched (design D7).
- [x] 4.4 Render `Profile & Settings` disabled, with a comment recording that the page is
      out of scope for EP-000, so nobody "fixes" it into a broken link (design D3).
- [x] 4.5 Wire `Sign out` to the mutation from 2.3 and navigate to `/login` afterwards,
      including when the request fails.
- [x] 4.6 Show a `Sign in` button linking to `/login` when there is no session, and reserve
      the avatar's space while the session check is still in flight (design D4).

## 5. Cover the header with tests

- [x] 5.1 Add `src/components/nav/TopNav.test.tsx` following the existing
      `CatalogPage.test.tsx` pattern: mock `@/lib/api`, render inside `MemoryRouter` and a
      `QueryClientProvider`.
- [x] 5.2 Assert the logo targets `/dashboard` and that the active link — and only the
      active link — is exposed as the current page.
- [x] 5.3 Assert the mobile toggle reveals and hides the second nav grouping.
- [x] 5.4 Assert the signed-out fallback links to `/login`.
- [x] 5.5 Assert the avatar menu shows the display name, email, `Profile & Settings`, and
      `Sign out` for a signed-in user.
- [x] 5.6 Assert `Sign out` posts `/auth/logout` and lands on `/login`.

## 6. Verify manually against the prototype

- [x] 6.1 Run the prototype and the frontend side by side and compare the header at
      desktop width — logo, pill highlight, avatar placement, open menu.
- [x] 6.2 Serve `GET /users/me` and `POST /auth/logout` from a scratch process outside the
      repo and point the dev server at it via `VITE_API_URL`, so the signed-in states can be
      exercised without committing a fake (design D12).
- [x] 6.3 Walk the signed-in path: active highlight moves between sections, logo returns
      home, menu opens, `Sign out` lands on `/login`, and the header then offers `Sign in`.
- [x] 6.4 Walk the same header at phone width: links hidden, toggle expands them, choosing
      one navigates and collapses the menu, toggling again collapses without navigating.
- [x] 6.5 Confirm the initials fallback is legible against the dark bar at full resolution —
      the specific defect that motivated design D7.

## 7. Keep the repo checks green

- [x] 7.1 Run `npm run typecheck`, `npm run lint:ci`, `npm run format:check`, `npm test`,
      and `npm run build` — `lint:ci` and `format:check` are what CI runs, and
      `--max-warnings 0` means any warning fails.
- [x] 7.2 Confirm no temporary debugging or stub code is committed; the stub from 6.2 lives
      outside the repository.

## 8. Follow-ups to file separately

- [ ] 8.1 Decide whether the header follows a future app-wide theme or stays permanently
      dark (design D1, open question) — needs a theming decision first.
- [ ] 8.2 Turn `Profile & Settings` into a real link once a destination exists (design D3).
- [ ] 8.3 Implement the breadcrumb below the header (FR-SHELL-005); `Breadcrumb.tsx` is
      still a component that returns `null`.
- [ ] 8.4 Implement the route-transition loading indicator (NFR-SHELL-002), possibly hosted
      by the header (design, open question).
- [ ] 8.5 Confirm, when EP-001 implements `GET /users/me`, that it returns the `{ data }`
      envelope this header assumes (design D5).
