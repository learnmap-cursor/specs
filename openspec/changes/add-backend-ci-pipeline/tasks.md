All file paths are relative to the `learnmap-cursor/backend` repository.

## 1. Pin the toolchain

- [x] 1.1 Create `.nvmrc` containing `24`, matching the Node major currently used for
      development (v24.12.0) and supported by Nest 11 / TypeScript 5.7.
- [x] 1.2 Confirm `nvm use` (or the equivalent for your version manager) selects Node 24
      in the repo root, so local and CI cannot drift.

## 2. Add a lint entry point that reports instead of repairing

- [x] 2.1 Add a `lint:ci` script to `package.json`:
      `eslint "{src,apps,libs,test}/**/*.ts" --max-warnings 0` — same glob as `lint`, but
      no `--fix`. Leave the existing `lint` script unchanged so local auto-fix still works.
- [x] 2.2 Verify `npm run lint:ci` exits `0` on a clean checkout (ESLint currently reports
      zero problems, so no cleanup pass should be needed).
- [x] 2.3 Prove the gate works: temporarily add a badly formatted file under `src/`, confirm
      `npm run lint:ci` exits non-zero **and leaves the file unmodified**, then delete it.
      This is the specific failure mode the change exists to fix, so verify it directly
      rather than assuming.
- [x] 2.4 Prove the warning gate works: temporarily introduce an unawaited promise that
      triggers `@typescript-eslint/no-floating-promises` (severity `warn`), confirm
      `npm run lint:ci` exits non-zero because of `--max-warnings 0`, then revert.

## 3. Create the workflow

- [x] 3.1 Create `.github/workflows/ci.yml` — the repo's first workflow. Trigger:
      `pull_request` with `branches: [main]`. No `push` trigger (see design D7).
- [x] 3.2 Set `permissions: contents: read` at the workflow level so the job token cannot
      write to the repository.
- [x] 3.3 Add a `concurrency` group keyed on the pull request ref with
      `cancel-in-progress: true`, so a second push cancels the superseded run.
- [x] 3.4 Define a single job with a stable id and display name (this name becomes the
      required status check, so treat renaming it as a breaking change), running on
      `ubuntu-latest` with `timeout-minutes: 3`.
- [x] 3.5 Add steps in order: `actions/checkout` → `actions/setup-node` with
      `node-version-file: .nvmrc` and `cache: 'npm'` → `npm ci`.
- [x] 3.6 Add an explicit `npx prisma generate` step with a short comment explaining that
      lint and build both resolve types from the generated client, so the step is
      deliberate rather than redundant (see design D3) and survives future cleanup.
- [x] 3.7 Add the verification steps: `npm run lint:ci` → `npm run build` → `npm test`.
- [x] 3.8 Confirm the workflow declares no `services:`, no `env:` database URL, and no
      secrets — the pipeline must pass in a repo with nothing configured.

## 4. Validate the pipeline on its own pull request

- [x] 4.1 Open a pull request against `main` with the changes above. Because the trigger is
      `pull_request`, the workflow validates itself on this PR — the first green run is the
      acceptance test.
- [x] 4.2 Confirm the run completes well inside the 3-minute timeout, and record the actual
      duration in the PR description for future comparison.
- [x] 4.3 Confirm the run succeeded with no database, no service container, and no secrets.
- [x] 4.4 Push a deliberate formatting violation to the branch, confirm the check turns red,
      then revert. Verify the failure names the lint step.
- [x] 4.5 Push twice in quick succession and confirm the superseded run is cancelled rather
      than running to completion.

## 5. Document the pipeline

- [x] 5.1 Update `README.md` with how to reproduce the CI checks locally
      (`npm run lint:ci && npm run build && npm test`).
- [x] 5.2 Update `AGENTS.md`: note that `lint:ci` is the non-mutating counterpart to
      `lint` (which still rewrites files), and that `--max-warnings 0` means any
      `warn`-severity ESLint rule blocks merge — a non-obvious consequence for anyone
      adding a rule they intend to be advisory.

## 6. Make the check block merges

- [x] 6.1 Determine what `learnmap-cursor/backend`'s GitHub plan and visibility actually
      allow. The branch-protection API currently returns
      `403 "Upgrade to GitHub Pro or make this repository public"`; check whether rulesets
      are available even though classic branch protection is not.
- [ ] 6.2 If available, require the job's check on `main` and enable "require branches to
      be up to date before merging".
- [ ] 6.3 Verify blocking end to end: open a PR with a failing check and confirm the merge
      button is disabled.
- [ ] 6.4 If not available, record the decision (upgrade the plan, make the repo public, or
      accept advisory CI) on FAB-16, and close that acceptance criterion as deferred with a
      follow-up issue rather than leaving it silently unmet.

## 7. Follow-ups to file separately

- [ ] 7.1 Open an issue for running the e2e suite in CI: it needs a `services: postgres`
      container plus `prisma migrate deploy`. The two migrations and `migration_lock.toml`
      already exist, so this is small but out of scope here.
- [ ] 7.2 Decide whether `no-floating-promises` and `no-unsafe-argument` should become
      `error` in `eslint.config.mjs` so local lint matches CI, instead of depending on
      `--max-warnings 0` (design D2, open question).
