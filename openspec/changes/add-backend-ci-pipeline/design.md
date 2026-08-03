## Context

`learnmap-cursor/backend` has no `.github/workflows/` directory — this is the repo's
first workflow, so there is no house style to follow and no existing check to extend.

Measured on the current codebase (warm `node_modules`, local machine):

| Step | Command | Duration |
| --- | --- | --- |
| Lint | `eslint` over `{src,apps,libs,test}/**/*.ts`, no `--fix` | 4.7s |
| Build | `nest build` | 3.4s |
| Unit tests | `jest`, 2 suites / 2 tests, all passing | 0.9s |

Roughly nine seconds of real work. The three-minute budget is therefore almost entirely
a question about dependency install: 759 packages in the lockfile and 483 MB of
`node_modules`, plus a `postinstall` hook that runs `prisma generate` on every install.
Estimated shape of a GitHub-hosted run:

```
  3:00 budget  ├────────────────────────────────────────────────┤
               0s                                            180s
  checkout     ▓ ~3s
  setup-node   ▓▓ ~5s        (restoring the npm cache)
  npm ci       ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ~45-75s   ◀── dominates
  generate     ▓▓ ~10s
  lint         ▓▓ ~5s
  build        ▓▓ ~4s
  test         ▓ ~1s
               ────────────────────────────────
               ≈ 70-105s, roughly half the budget spare
```

Two constraints shape the design more than the numbers do.

**The existing lint script cannot fail.** `package.json` defines
`lint: eslint "{src,apps,libs,test}/**/*.ts" --fix`. This was verified empirically: a
deliberately mangled file placed in `src/` was rewritten to correct formatting and the
script exited `0`. Auto-fix repairs the violation inside the runner's disposable
checkout, so CI would report success for a branch that still contains it. Separately,
`eslint.config.mjs` sets `no-floating-promises` and `no-unsafe-argument` to `warn`, and
ESLint exits `0` on warnings — so an unawaited promise in a Nest service would also pass.

**Nothing in the pipeline needs PostgreSQL**, which keeps it a single job with no
service containers. `prisma generate` works offline, `roadmaps.service.spec.ts` injects a
mocked `PrismaService`, and Jest's `rootDir: "src"` excludes `test/app.e2e-spec.ts` —
the one spec that boots `AppModule` and therefore triggers `PrismaService.onModuleInit`
→ `$connect()`.

## Goals / Non-Goals

**Goals:**
- Every pull request to `main` gets an automatic pass/fail signal on formatting, lint
  rules, type-checking, and unit tests.
- Lint and build failures are real failures — no silent repair, no warning-shaped
  escapes.
- The three-minute budget is enforced by the pipeline, not merely hoped for.
- The pipeline is reproducible locally: a developer can run the same checks before
  pushing.
- Local developer ergonomics are unchanged; nobody loses `npm run lint`'s auto-fix.

**Non-Goals:**
- Any workflow in the frontend repo. FAB-17 owns that, and duplicating a ~40-line
  workflow is cheaper than sharing one across repos.
- Running the end-to-end suite. It needs a PostgreSQL service container plus
  `prisma migrate deploy`, which is a materially larger design.
- Deployment, publishing, container builds, coverage thresholds, or dependency scanning.
- Test coverage improvements. The suite has two tests; growing it is separate work.

## Decisions

### D1: Add a dedicated check-only lint script rather than redefining `lint`

Add `lint:ci` to `package.json`, running the same glob as `lint` but without `--fix`
and with `--max-warnings 0`. CI calls `npm run lint:ci`.

*Alternatives considered.* Redefining `lint` as check-only and moving auto-fix to
`lint:fix` is the more conventional layout, but it changes muscle memory for everyone
and contradicts `AGENTS.md`, which documents that `npm run lint` rewrites files;
retraining humans is a bigger cost than one extra script. Inlining `npx eslint …` in the
workflow YAML avoids touching `package.json`, but then the file glob lives in two places
and a developer cannot reproduce the CI check locally with a single command — which
undermines a stated goal.

*Trade-off accepted.* The glob is duplicated between `lint` and `lint:ci` and could
drift. They sit adjacent in `package.json`, which makes drift visible in review.

### D2: `--max-warnings 0` in CI, leaving rule severities alone

`no-floating-promises` and `no-unsafe-argument` become merge blockers via the CI flag,
rather than by promoting them to `error` in `eslint.config.mjs`.

*Rationale.* Verified safe: ESLint currently reports zero problems including zero
warnings, so this needs no cleanup pass. Keeping severities as `warn` means local lint
stays advisory on these two rules while CI is strict.

*Alternative considered.* Promoting both to `error` in the shared config would make
local and CI behaviour identical, which is arguably better. It is listed as an open
question rather than decided here, because it changes the authoring experience for
everyone and deserves its own conversation.

### D3: Explicit `prisma generate` step despite `postinstall` already running it

*Rationale.* Lint uses `recommendedTypeChecked` with `projectService`, and build is
`tsc` — both resolve types from the generated `@prisma/client`. That dependency is real
but currently invisible, satisfied only as a side effect of the `postinstall` hook. If
anyone adds `--ignore-scripts` for install speed or drops the hook, CI fails with
confusing type errors rather than a clear cause. An explicit step names the dependency.

*Cost.* About ten seconds of duplicated work, against ~75s of headroom.

*Alternative rejected.* `npm ci --ignore-scripts` followed by an explicit generate would
remove the duplication, but it also suppresses the `prisma`/`@prisma/engines` install
scripts that fetch the query engines, which risks breaking generation outright.

### D4: Single Node version from a committed `.nvmrc`, no matrix

Create `.nvmrc` pinning Node `24` (the current dev machine runs v24.12.0; Nest 11 and
TypeScript 5.7 support it). The workflow reads it via `setup-node`'s
`node-version-file`, so the version is never written twice.

*Alternative rejected.* A matrix across Node 20/22/24 triples runner cost for a service
with exactly one deployment target and no published package. Major-only pinning (`24`
rather than `24.12.0`) lets patch and minor updates flow without lockfile churn, at the
cost of a small reproducibility gap between runs.

### D5: `npm ci` with `setup-node`'s built-in npm cache

*Rationale.* `npm ci` is lockfile-exact and fails loudly when `package.json` and the
lockfile disagree, which is a check worth having.

*Alternative deferred.* Caching `node_modules` keyed on the lockfile hash would be
faster still, but it is fragile across Node and platform changes and can resurrect stale
native builds. The measured headroom does not justify that risk yet. Note that the npm
cache stores downloads, not `node_modules`, so install and `postinstall` still run every
time — the cache saves network, not linking.

### D6: Enforce the budget with a three-minute job timeout

*Rationale.* This turns "completes in under 3 minutes" from an unverifiable aspiration
into a condition the pipeline tests on every run. Three minutes is roughly double the
estimated worst case.

*Risk acknowledged.* A cold cache or a slow runner could fail a healthy build. See Risks.

### D7: Trigger on `pull_request` against `main` only

No `push` trigger. The acceptance criterion is PR-scoped, and once the check is
required — with the "branches must be up to date" option — the PR run already covers
what a post-merge run would tell us. A `push` trigger can be added later if
post-merge `main` health becomes interesting on its own.

### D8: Stable, decoupled check name

The workflow gets a fixed job identifier and display name, and the required-status-check
configuration refers to that name. Steps can be added or reordered freely without
breaking branch protection. Renaming the job is then a breaking change to repo settings
and must be done deliberately.

### D9: Run unit tests even though the issue does not ask for them

*Rationale.* The suite takes 0.9s, needs no database, and currently passes. Excluding it
would mean a PR could break a passing test and still merge, which is a strange gap in a
pipeline whose purpose is to block bad merges.

### D10: Treat merge blocking as configuration, not code

The workflow only reports status. Making it block is a repository setting, and the
branch-protection API for this repo currently returns
`403 "Upgrade to GitHub Pro or make this repository public"`. The design therefore ships
a pipeline that is correct and advisory on day one, and becomes blocking by flipping a
setting with no file change.

## Risks / Trade-offs

- **A three-minute timeout could fail healthy runs** on a cold cache, during a GitHub
  incident, or if the dependency tree grows → Mitigation: the budget is ~2x the estimated
  worst case, and the first real runs will show actual durations. If it proves flaky,
  raise the timeout and track duration separately rather than deleting the guard —
  the acceptance criterion is a real requirement, not decoration.
- **`--max-warnings 0` makes any future `warn`-severity rule an immediate merge
  blocker**, which can surprise someone adding a rule intending it to be advisory →
  Mitigation: document the behaviour in `AGENTS.md`; if it becomes friction, switch to
  promoting specific rules to `error` and drop the flag.
- **Lint globs duplicated between `lint` and `lint:ci`** → Mitigation: adjacent in
  `package.json`; a mismatch is visible in review.
- **The explicit generate step is redundant today** and a reviewer may read it as noise →
  Mitigation: D3 records why it exists; a brief comment in the workflow prevents someone
  "cleaning it up" without understanding the coupling.
- **Prisma engine downloads make install network-dependent**, so a registry or CDN
  hiccup fails an otherwise-good PR → Mitigation: the npm cache reduces exposure;
  transient failures are handled by re-running the job.
- **CI is advisory until required checks are available**, so a red pipeline can still be
  merged by anyone who ignores it → Mitigation: resolve the plan/visibility question as
  a tracked follow-up; in the meantime the signal is visible on every PR.

## Migration Plan

The change is purely additive: two new files, one new script, and documentation. There
is no data migration, no runtime impact, and nothing to deploy.

1. Add `.nvmrc`, the `lint:ci` script, and `.github/workflows/ci.yml` on a branch.
2. Open the pull request. Because the trigger is `pull_request` against `main`, the
   workflow validates itself on the very PR that introduces it — the first green run is
   the acceptance test.
3. Confirm the observed duration against the three-minute budget, and confirm the run
   needed no secrets and no database.
4. Deliberately push a formatting violation to the branch and confirm the check goes
   red, then revert it. This is the acceptance test for the `--fix` problem the change
   exists to solve; without it, the fix is unproven.
5. Merge, then configure the check as required on `main` — if the plan permits.

**Rollback.** Delete the workflow file, or un-require the check. Nothing else depends on
it. Reverting the `lint:ci` script and `.nvmrc` is optional, since neither affects
existing commands.

## Open Questions

- **Can required status checks be enabled at all?** Branch protection is refused on the
  current plan. The options are upgrading the GitHub plan, making the repo public, or
  accepting advisory CI and closing that acceptance criterion as deferred. This is a
  decision for the repo owner, not something the implementation can resolve. Rulesets
  may be available where classic branch protection is not — worth checking before
  assuming the criterion is unreachable.
- **Should `no-floating-promises` and `no-unsafe-argument` become `error` in
  `eslint.config.mjs`** so local and CI behaviour match, instead of relying on
  `--max-warnings 0`? (See D2.)
- **Is a post-merge `push` trigger on `main` worth adding** for main-branch health
  visibility? (See D7.)
- **When should the e2e suite join CI?** It needs a `services: postgres` container and
  `prisma migrate deploy`; the two migrations and `migration_lock.toml` already exist, so
  this is a small follow-up rather than a research task. Likely its own issue.
- **Node pin granularity:** major-only (`24`) as decided, or an exact version for
  stricter reproducibility?
