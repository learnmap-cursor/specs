## Purpose

Defines the persistent top navigation bar that every authenticated LearnMap page shares:
how it identifies the product, how it moves users between the primary sections, how it
signals where they are, how it adapts to narrow screens, and what the user menu offers in
both signed-in and signed-out states.

## ADDED Requirements

### Requirement: Every authenticated page shares one persistent header

Every page reached while signed in SHALL render inside a shared layout whose top
navigation bar is identical across those pages. Moving between sections SHALL replace
only the page content: the header SHALL NOT be torn down and rebuilt, so it neither
flickers nor loses its own state. The header SHALL remain visible when the page content
scrolls. Pages outside the authenticated shell — sign-in and onboarding — SHALL NOT show
it.

#### Scenario: Moving between two sections

- **WHEN** a signed-in user navigates from the dashboard to the roadmap catalog
- **THEN** the header remains on screen throughout
- **AND** only the content below it changes

#### Scenario: Scrolling a long page

- **WHEN** a user scrolls down a page whose content is taller than the viewport
- **THEN** the header stays fixed at the top of the viewport

#### Scenario: Sign-in page

- **WHEN** an unauthenticated visitor is shown the sign-in page
- **THEN** no top navigation bar is rendered

### Requirement: The header identifies the product and links home

The header SHALL display the LearnMap name together with a graphic mark, positioned at
the leading edge. Activating it SHALL navigate to the dashboard from anywhere in the
authenticated app.

#### Scenario: Returning home from a nested page

- **WHEN** a user viewing an individual roadmap activates the LearnMap mark
- **THEN** they are taken to the dashboard

### Requirement: The header links to the primary sections

The header SHALL offer navigation to exactly two primary sections — the dashboard and the
roadmap catalog — labelled `Dashboard` and `Browse Roadmaps`. Additional destinations
SHALL NOT be added to the bar without a spec change, so the bar stays legible as the
product grows.

#### Scenario: Navigating to the catalog

- **WHEN** a user activates `Browse Roadmaps`
- **THEN** the roadmap catalog is shown

### Requirement: The header indicates the current section

The link for the section the user is currently in SHALL be visually distinguished from
the others, and SHALL also be identifiable programmatically as the current page so
assistive technology conveys the same information. The distinction SHALL be derived from
the current location, not from anything the page passes in, so it can never disagree with
what is on screen. When the current location belongs to neither primary section, no link
SHALL be marked current.

#### Scenario: Viewing the catalog

- **WHEN** the user is on the roadmap catalog
- **THEN** `Browse Roadmaps` is visually highlighted and exposed as the current page
- **AND** `Dashboard` is neither highlighted nor exposed as current

#### Scenario: Viewing a page outside both sections

- **WHEN** the user is viewing an individual roadmap
- **THEN** neither `Dashboard` nor `Browse Roadmaps` is marked as the current page

### Requirement: Navigation links collapse into a menu on small screens

At viewport widths too narrow to show the links inline, the header SHALL hide them and
offer a single toggle in their place. The toggle SHALL expose its expanded or collapsed
state and an accessible name describing what activating it does. Expanding SHALL reveal
the same destinations, with the current section marked exactly as it is on wide screens.

#### Scenario: Narrow viewport

- **WHEN** the header is displayed on a phone-width viewport
- **THEN** the section links are not shown inline
- **AND** a toggle for revealing them is shown

#### Scenario: Choosing a destination from the expanded menu

- **WHEN** the user expands the menu and activates one of the destinations
- **THEN** the app navigates to that destination
- **AND** the menu collapses without further input

#### Scenario: Dismissing the menu without navigating

- **WHEN** the user expands the menu and then activates the toggle again
- **THEN** the menu collapses
- **AND** the current page is unchanged

### Requirement: The header presents the signed-in user in a menu

When a session is established, the trailing edge of the header SHALL show the user's
profile picture, and SHALL fall back to their initials when no picture is available.
Activating it SHALL open a menu that shows the user's display name and email address and
offers `Profile & Settings` and `Sign out`. The menu SHALL be openable and operable by
keyboard alone.

#### Scenario: User has no profile picture

- **WHEN** the signed-in user has no profile picture
- **THEN** the header shows their initials, derived from their display name, in its place

#### Scenario: Opening the menu

- **WHEN** the user activates their avatar
- **THEN** a menu opens showing their display name and email address
- **AND** it offers `Profile & Settings` and `Sign out`

### Requirement: Profile & Settings is offered but never leads nowhere

`Profile & Settings` SHALL be listed in the user menu. Until a Profile & Settings
destination exists, the entry SHALL be presented as unavailable rather than linking to a
destination that cannot be reached: a user SHALL NOT be able to activate it into an error
or an empty page.

#### Scenario: No Profile & Settings page exists yet

- **WHEN** a user opens the user menu
- **THEN** `Profile & Settings` is visible and visibly unavailable
- **AND** activating it neither navigates nor reports an error

### Requirement: Signing out ends the session and returns to sign-in

`Sign out` SHALL be reachable from the user menu on every authenticated page. Choosing it
SHALL ask the server to end the session, SHALL discard data cached for that user in the
client, and SHALL leave the user on the sign-in page. Discarding cached data and leaving
the authenticated area SHALL happen even when the server request fails, so a failure
cannot strand the previous user's data on screen.

#### Scenario: Successful sign-out

- **WHEN** a signed-in user chooses `Sign out`
- **THEN** the server is asked to end the session
- **AND** the user lands on the sign-in page
- **AND** no data belonging to that user remains cached in the client

#### Scenario: Sign-out request fails

- **WHEN** the request to end the session fails
- **THEN** the client still discards the cached data and shows the sign-in page

### Requirement: The header stays coherent without a session

When no session can be established, the header SHALL offer a way to sign in, leading to
the sign-in page, in place of the user menu. While it is still being determined whether a
session exists, the header SHALL show neither, and SHALL reserve the space so its layout
does not shift once the answer arrives.

#### Scenario: No session

- **WHEN** the header renders and no session can be established
- **THEN** it offers a sign-in affordance leading to the sign-in page
- **AND** no avatar or user menu is shown

#### Scenario: Session state not yet known

- **WHEN** the check for an existing session has not yet completed
- **THEN** the header shows neither the avatar nor the sign-in affordance
- **AND** the surrounding header layout does not move when the check completes

### Requirement: The header is navigable by keyboard and screen reader

The header SHALL be exposed as a navigation landmark whose links are reachable and
activatable by keyboard. Each set of navigation links SHALL carry an accessible name that
distinguishes it from the others, so a screen-reader user encountering more than one
grouping can tell them apart. Every control that is not self-describing by its text —
the collapse toggle and the avatar — SHALL carry an accessible name.

#### Scenario: Keyboard-only user reaches the catalog

- **WHEN** a user tabs into the header and activates `Browse Roadmaps` with the keyboard
- **THEN** the catalog is shown

#### Scenario: Screen reader encounters the avatar control

- **WHEN** a screen-reader user focuses the control that opens the user menu
- **THEN** it is announced with a name describing that it opens the user menu
