# AGENTS.md

## Cursor Cloud specific instructions

This repository (`learnmap/specs`) is a **documentation / specs-only repository**. It contains
requirements (`requirements/`), architecture docs (`architecture/`), ADRs (`decisions/`),
diagrams (`diagrams/`), GitHub issue templates (`.github/ISSUE_TEMPLATE/`), a CI workflow
(`.github/workflows/issue-to-pr.yml`), and Claude Code agent definitions (`.claude/agents/`).

There is **no production application** in the root of this repository. The actual LearnMap
product lives in separate sibling repos (`learnmap/frontend` / `app` — React + Vite;
`learnmap/backend` / `api` — NestJS + Prisma + PostgreSQL), which are not part of this
repository.

An exception is **`prototype/`**: a clickable Vite + shadcn/ui MVP mock that demonstrates
the approved requirements. It is self-contained (`cd prototype && npm install && npm run
dev`) and is not required for specs/docs work.

### Working in this repo
- Most changes are edits to Markdown or YAML. No install/build step is required for docs;
  the update script is intentionally a no-op.
- For the prototype only: `cd prototype && npm install && npm run dev` (or `npm run build`).
- The only other executable artifacts are GitHub Actions / issue-form YAML that run on
  GitHub's infrastructure, not locally.

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
