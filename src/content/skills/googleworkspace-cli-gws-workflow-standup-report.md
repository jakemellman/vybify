---
name: Gws Workflow Standup Report
tagline: "Google Workflow: Today's meetings + open tasks as a standup summary."
url: "https://skills.sh/googleworkspace/cli/gws-workflow-standup-report"
github: googleworkspace/cli
author: googleworkspace
tags:
  - "claude-code"
  - googleworkspace
kind: "claude-code-skill"
install: "npx skills add googleworkspace/cli --skill gws-workflow-standup-report"
addedAt: "2026-05-05"
---

# workflow +standup-report

> **PREREQUISITE:** Read `../gws-shared/SKILL.md` for auth, global flags, and security rules. If missing, run `gws generate-skills` to create it.

Today's meetings + open tasks as a standup summary

## Usage

```bash
gws workflow +standup-report
```

## Flags

| Flag | Required | Default | Description |
|------|----------|---------|-------------|
| `--format` | — | — | Output format: json (default), table, yaml, csv |

## Examples

```bash
gws workflow +standup-report
gws workflow +standup-report --format table
```

## Tips

- Read-only — never modifies data.
- Combines calendar agenda (today) with tasks list.

## See Also

- [gws-shared](../gws-shared/SKILL.md) — Global flags and auth
- [gws-workflow](../gws-workflow/SKILL.md) — All cross-service productivity workflows commands
