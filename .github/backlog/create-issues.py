#!/usr/bin/env python3
"""Create INVEST implementation stories as GitHub issues (idempotent by title)."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

REPO = "learnmap-cursor/specs"
STORIES_PATH = Path(__file__).with_name("stories.json")


def run(cmd: list[str]) -> str:
    return subprocess.check_output(cmd, text=True).strip()


def existing_titles() -> dict[str, int]:
    raw = run(
        [
            "gh",
            "issue",
            "list",
            "-R",
            REPO,
            "--state",
            "all",
            "--limit",
            "200",
            "--json",
            "number,title",
        ]
    )
    return {i["title"]: i["number"] for i in json.loads(raw)}


def create_issue(title: str, body: str, labels: list[str]) -> int:
    cmd = ["gh", "issue", "create", "-R", REPO, "--title", title, "--body", body]
    # Only apply labels that already exist on the repo
    existing_names = {
        l["name"]
        for l in json.loads(
            run(
                [
                    "gh",
                    "label",
                    "list",
                    "-R",
                    REPO,
                    "--limit",
                    "100",
                    "--json",
                    "name",
                ]
            )
        )
    }
    for label in labels + ["backlog"]:
        if label in existing_names:
            cmd.extend(["--label", label])
    url = run(cmd)
    # url ends with /issues/N
    return int(url.rstrip("/").split("/")[-1])


def main() -> int:
    stories = json.loads(STORIES_PATH.read_text())
    stories = sorted(stories, key=lambda s: s["order"])
    known = existing_titles()
    key_to_number: dict[str, int] = {}

    # Seed key_to_number from existing issues with matching titles
    for s in stories:
        if s["title"] in known:
            key_to_number[s["key"]] = known[s["title"]]

    created = []
    skipped = []

    for s in stories:
        title = s["title"]
        if s["key"] in key_to_number:
            skipped.append((key_to_number[s["key"]], title))
            continue

        body = s["body"]
        parent_key = s.get("parent_key")
        if parent_key:
            parent_num = key_to_number.get(parent_key)
            if parent_num is None:
                print(f"ERROR: parent {parent_key} not created yet for {s['key']}", file=sys.stderr)
                return 1
            body = body.replace("{{PARENT}}", f"#{parent_num}")
        else:
            body = body.replace("{{PARENT}}", "(none)")

        # Resolve depends-on into issue numbers
        dep_keys = s.get("depends_on_keys") or []
        if dep_keys:
            dep_refs = []
            for dk in dep_keys:
                num = key_to_number.get(dk)
                if num:
                    dep_refs.append(f"#{num}")
            if dep_refs and "## Depends on" not in body:
                body = body.rstrip() + "\n\n## Depends on\n" + ", ".join(dep_refs) + "\n"

        # Embed intended labels in body when labels cannot be applied
        intended = ", ".join(s.get("labels") or [])
        if intended and "<!-- labels:" not in body:
            body = body.rstrip() + f"\n\n<!-- labels: {intended} -->\n"

        number = create_issue(title, body, s.get("labels") or [])
        key_to_number[s["key"]] = number
        created.append((number, title))
        print(f"Created #{number}: {title}")

    mapping_path = Path("/tmp/learnmap-issues/key-to-number.json")
    mapping_path.parent.mkdir(parents=True, exist_ok=True)
    mapping_path.write_text(json.dumps(key_to_number, indent=2))

    print("\n=== Summary ===")
    print(f"Created: {len(created)}")
    print(f"Skipped (already exist): {len(skipped)}")
    print(f"Mapping written to {mapping_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
