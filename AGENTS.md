# AGENTS.md

## Cursor Cloud specific instructions

This repository (`learnmap/specs`) is a **documentation / specs-only repository**. It contains
requirements (`requirements/`), architecture docs (`architecture/`), ADRs (`decisions/`),
diagrams (`diagrams/`), GitHub issue templates (`.github/ISSUE_TEMPLATE/`), a CI workflow
(`.github/workflows/issue-to-pr.yml`), and Claude Code agent definitions (`.claude/agents/`).

There is **no application to build, run, or serve here** and **no dependencies to install** —
there is no `package.json`, lockfile, source tree, or test suite. The actual LearnMap product
lives in separate sibling repos (`learnmap/frontend` / `app` — React + Vite; `learnmap/backend`
/ `api` — NestJS + Prisma + PostgreSQL), which are not part of this repository.

### Working in this repo
- Most changes are edits to Markdown or YAML. No install/build step is required; the update
  script is intentionally a no-op.
- The only executable artifacts are GitHub Actions / issue-form YAML that run on GitHub's
  infrastructure, not locally.

### Validating changes (lint/test analog)
- Validate YAML parses with the pre-installed Python + PyYAML:
  `python3 -c "import yaml,glob; [list(yaml.safe_load_all(open(f))) for f in glob.glob('.github/**/*.yml', recursive=True)]"`
- Issue-form templates in `.github/ISSUE_TEMPLATE/0*.yml` must each contain `name`,
  `description`, and `body` keys to be valid GitHub issue forms.

### The `issue-to-pr` workflow
- `.github/workflows/issue-to-pr.yml` is an AI-driven "issue → plan → manual signoff →
  implement → draft PR" pipeline. It only runs in GitHub Actions and requires the
  `ANTHROPIC_API_KEY` and `LEARNMAP_PAT` secrets plus an `issue-signoff` GitHub Environment
  approval gate. It cannot be exercised end-to-end from a local/cloud VM.
