## ADDED Requirements

### Requirement: Pull requests to main are verified automatically

The backend repository SHALL run an automated verification pipeline for every pull
request that targets the `main` branch, without any manual trigger. The pipeline SHALL
re-run when new commits are pushed to an open pull request.

#### Scenario: Pull request opened against main

- **WHEN** a contributor opens a pull request whose base branch is `main`
- **THEN** the verification pipeline starts automatically
- **AND** its result is reported as a check on that pull request

#### Scenario: New commits pushed to an open pull request

- **WHEN** a contributor pushes an additional commit to the head branch of an open pull
  request targeting `main`
- **THEN** the pipeline runs again against the updated head commit

#### Scenario: Pull request targets a branch other than main

- **WHEN** a pull request is opened whose base branch is not `main`
- **THEN** the pipeline does not run

### Requirement: The pipeline verifies install, code quality, compilation, and unit tests

The pipeline SHALL perform, in order: checkout of the pull request's merge state,
installation of dependencies from the committed lockfile, generation of the Prisma
client, a lint check, a production build, and the unit test suite. Any step that fails
SHALL fail the pipeline and SHALL NOT be skipped or reported as a warning.

#### Scenario: All checks pass

- **WHEN** the branch is correctly formatted, free of lint violations, compiles, and its
  unit tests pass
- **THEN** every step succeeds
- **AND** the pipeline reports a passing check

#### Scenario: Dependencies do not match the lockfile

- **WHEN** `package.json` and `package-lock.json` are inconsistent on the branch
- **THEN** the install step fails
- **AND** the pipeline reports a failing check without running lint, build, or tests

#### Scenario: A step fails partway through

- **WHEN** the lint step fails
- **THEN** the pipeline stops and reports a failing check
- **AND** subsequent steps do not report success

### Requirement: Lint failures are reported, never silently repaired

The lint step SHALL run ESLint in a reporting mode that does not modify files. It
SHALL NOT use auto-fix, because auto-fix repairs violations inside the disposable CI
checkout and exits successfully, which would report a pass for a branch that still
contains the violation. The lint step SHALL treat ESLint warnings as failures, so rules
configured at `warn` severity — currently `@typescript-eslint/no-floating-promises` and
`@typescript-eslint/no-unsafe-argument` — can block a merge.

#### Scenario: Branch contains an auto-fixable formatting violation

- **WHEN** a branch contains a file that violates a Prettier-enforced formatting rule
- **THEN** the lint step reports the violation and exits non-zero
- **AND** the pipeline reports a failing check
- **AND** no file in the checkout is rewritten

#### Scenario: Branch contains a warning-severity violation

- **WHEN** a branch contains an unawaited promise that triggers
  `@typescript-eslint/no-floating-promises` at `warn` severity
- **THEN** the lint step exits non-zero
- **AND** the pipeline reports a failing check

#### Scenario: Local developer workflow is unchanged

- **WHEN** a developer runs the repository's existing `lint` script locally
- **THEN** it still applies auto-fixes as it does today
- **AND** the CI lint entry point remains a separate, non-mutating command

### Requirement: The build step fails on type errors

The build step SHALL compile the application as it would for production, so that
TypeScript errors fail the pipeline even when no test covers the affected code.

#### Scenario: Branch introduces a type error

- **WHEN** a branch contains code that does not type-check
- **THEN** the build step fails
- **AND** the pipeline reports a failing check

### Requirement: The pipeline requires no database

The pipeline SHALL complete without a PostgreSQL instance, a database connection, or
any repository secret. Prisma client generation SHALL run offline, and the test step
SHALL execute only the database-free unit suite. The database-dependent end-to-end
suite SHALL NOT run in this pipeline.

#### Scenario: Pipeline runs with no database service and no secrets configured

- **WHEN** the pipeline runs in a repository with no configured secrets and no database
  service container
- **THEN** dependency install, Prisma client generation, lint, build, and unit tests all
  succeed

#### Scenario: End-to-end suite is excluded

- **WHEN** the test step runs
- **THEN** it executes the unit suite rooted at `src`
- **AND** it does not execute the end-to-end suite that boots the application module and
  connects to PostgreSQL

### Requirement: The pipeline completes within three minutes

The pipeline SHALL finish within three minutes and SHALL enforce that budget itself
rather than relying on observation, so a regression in pipeline duration surfaces as a
failure. It SHALL cache dependency downloads between runs, since dependency install
dominates its runtime.

#### Scenario: Pipeline exceeds the budget

- **WHEN** the pipeline has been running for longer than three minutes
- **THEN** it is terminated automatically
- **AND** the pipeline reports a failing check

#### Scenario: Typical run

- **WHEN** the pipeline runs on a pull request with a warm dependency cache
- **THEN** it completes in well under three minutes

### Requirement: Superseded runs are cancelled and the pipeline is least-privileged

When a newer commit supersedes an in-flight run for the same pull request, the older run
SHALL be cancelled so that only the latest commit consumes runner capacity. The pipeline
SHALL be granted no more than read access to repository contents.

#### Scenario: Rapid successive pushes

- **WHEN** a contributor pushes twice in quick succession to the same pull request
- **THEN** the run for the superseded commit is cancelled
- **AND** only the run for the newest commit continues to completion

#### Scenario: Pipeline attempts no writes

- **WHEN** the pipeline runs
- **THEN** its credentials permit reading repository contents only
- **AND** it does not push commits, comments, or tags

### Requirement: The toolchain version is pinned and shared with local development

The Node.js version used by the pipeline SHALL be defined in a committed file that
local development also consumes, so that CI and developer machines cannot drift apart.
The pipeline SHALL read the version from that file rather than hardcoding it.

#### Scenario: Version is changed

- **WHEN** the pinned Node version is updated in the committed file
- **THEN** the pipeline uses the new version on its next run with no workflow edit

#### Scenario: Developer sets up the repository

- **WHEN** a developer uses a Node version manager in the repository root
- **THEN** it selects the same Node version the pipeline uses

### Requirement: A failing pipeline blocks merge

The pipeline's check SHALL be configured as a required status check on `main`, so a
pull request with a failing pipeline cannot be merged. The check SHALL expose a stable
name so that this configuration does not break when the workflow is edited.

#### Scenario: Pull request with a failing pipeline

- **WHEN** the pipeline reports a failing check on a pull request targeting `main`
- **AND** the check is configured as required
- **THEN** the pull request cannot be merged until the failure is resolved

#### Scenario: Required checks are unavailable on the repository's plan

- **WHEN** the hosting plan or repository visibility does not permit required status
  checks
- **THEN** the pipeline still runs and reports pass or fail on every pull request
- **AND** the blocking behaviour is enabled by configuration alone, with no change to the
  workflow, once required checks become available

#### Scenario: Workflow is edited

- **WHEN** steps are added to or removed from the workflow
- **THEN** the reported check name is unchanged
- **AND** the required-check configuration continues to match it
