# LearnMap — Specs

Central repository for requirements, architecture, and design decisions.
All project-level and cross-cutting issues are tracked here and surfaced on the
[LearnMap Project board](https://github.com/orgs/learnmap-cursor/projects/1)
(created by the **Bootstrap backlog** workflow if missing).

Implementation stories live as issues in this repo. The ordered backlog
definitions are in [`.github/backlog/`](.github/backlog/).

This repo is also the **[OpenSpec](https://openspec.dev) store** (`learnmap`) for
frontend and backend. Active change proposals live under `openspec/`; register it
once on your machine:

```bash
openspec store register /path/to/specs --id learnmap
```

## Structure

| Folder | Purpose |
|---|---|
| `openspec/` | OpenSpec specs and change proposals (shared store) |
| `requirements/` | Functional and non-functional requirements |
| `architecture/` | System design documents |
| `decisions/` | Architecture Decision Records (ADRs) |
| `diagrams/` | System and flow diagrams |

## Issue Types

Use the issue templates to create: **Epic · Feature · Task · Bug · Spike**
