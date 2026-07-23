# Implementation backlog

Machine-readable INVEST stories for LearnMap, ordered for sequential delivery.

1. Start with **Iteration 0** (scaffold `learnmap/app` + `learnmap/api`).
2. Then epics EP-000 → EP-005 and their child stories.
3. UI stories reference `prototype/` where applicable.

## Files

| File | Purpose |
|---|---|
| `stories.json` | Story definitions (title, labels, body, parent, depends-on) |
| `create-issues.py` | Idempotent script to create GitHub issues in order |

## Create issues

```bash
python3 .github/backlog/create-issues.py
```

## Project board

Run the **Bootstrap backlog** workflow (Actions → Bootstrap backlog → Run workflow)
to create labels, ensure the LearnMap org project exists, and add open issues to
**Backlog**. Requires `LEARNMAP_PAT` (or a token with `project` + `issues` write)
if the default `GITHUB_TOKEN` cannot manage org projects.
