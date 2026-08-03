## Why

The backend repo has no automated checks: every PR to `main` has merged on human
review alone, so a formatting violation, a type error, or a broken build can land
undetected. Iteration 0 is the right moment to fix this, while the codebase is small
enough that the first pipeline is trivially fast and every later PR inherits the gate.

Scope is deliberately one repo. `learnmap-cursor/frontend` has its own ticket
(FAB-17), so this change introduces no shared or reusable workflow machinery —
duplicating a small workflow in two repos is cheaper than coordinating one across
them.

## What Changes

- Add `.github/workflows/ci.yml` to `learnmap-cursor/backend`: a single job triggered
  by `pull_request` against `main`, running checkout, dependency install, Prisma client
  generation, lint, build, and unit tests.
- Add a check-only lint entry point. The existing `lint` script runs
  `eslint --fix`, which repairs auto-fixable violations in the runner's throwaway
  checkout and exits `0` — so calling it from CI would report success while the branch
  keeps the unformatted code. CI needs a script that reports rather than repairs.
- Promote ESLint warnings to failures **in CI only**, so `no-floating-promises` and
  `no-unsafe-argument` (currently configured as `warn`, and therefore invisible to a
  default ESLint exit code) can block a merge.
- Pin the Node version in a committed file so CI and local development share one
  source of truth; the repo currently has neither `.nvmrc` nor an `engines` field.
- Enforce the runtime budget in the workflow itself via a job timeout, rather than
  leaving "under 3 minutes" as an unverified aspiration.
- Configure the workflow's check as a required status check on `main` so a failure
  actually blocks merge. This is a repository-settings step, not a file, and it is
  currently refused on this repo's GitHub plan — see Impact.

Explicitly **not** in this change: the end-to-end test suite (it boots `AppModule`,
which connects to PostgreSQL, so it needs a service container and a migration step),
deployment, test coverage thresholds, and any workflow in the frontend repo.

## Capabilities

### New Capabilities
- `backend-ci`: Automated pre-merge verification for the backend repository — which
  checks run on a pull request, what makes them fail, how the result gates merging,
  and the runtime budget they must respect.

### Modified Capabilities

_None. `openspec/specs/` currently contains no capabilities, so there are no existing
requirements to revise._

## Impact

**New files in `learnmap-cursor/backend`**
- `.github/workflows/ci.yml` — the first workflow in the repo; no `.github/workflows/`
  directory exists today.
- `.nvmrc` — pinned Node version consumed by CI and by local `nvm` users.

**Modified files in `learnmap-cursor/backend`**
- `package.json` — one added script for check-only linting. The existing `lint`,
  `build`, and `test` scripts keep their current behaviour so local habits are
  unaffected.
- `README.md` and `AGENTS.md` — document how to reproduce the CI checks locally.

**No impact on** application or runtime code, the Prisma schema, migrations, the
database, or the frontend repo. No new dependencies. The pipeline needs no PostgreSQL
service: unit tests mock `PrismaService`, `prisma generate` requires no connection,
and the DB-dependent e2e spec is excluded from `npm test` by Jest's `rootDir: "src"`.

**External dependency — merge blocking.** A workflow only reports a check status;
blocking a merge requires a required status check via branch protection or a ruleset.
The branch-protection API on `learnmap-cursor/backend` currently returns
`403 "Upgrade to GitHub Pro or make this repository public to enable this feature."`
Satisfying that acceptance criterion therefore depends on a plan or visibility
decision outside this repo. The workflow is designed so it needs no change once the
setting becomes available: the check name is stable and the job fails loudly. Until
then CI is advisory.

**Risk if the lint gate is adopted as specified.** Verified against the current
codebase: `eslint` without `--fix` reports zero problems, including zero warnings, so
a strict check-only lint passes today and this change does not require a cleanup pass.
