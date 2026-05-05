---
name: Gws Drive Upload
tagline: "Google Drive: Upload a file with automatic metadata."
url: "https://skills.sh/googleworkspace/cli/gws-drive-upload"
github: googleworkspace/cli
author: googleworkspace
tags:
  - "claude-code"
  - googleworkspace
kind: "claude-code-skill"
install: "npx skills add googleworkspace/cli --skill gws-drive-upload"
addedAt: "2026-05-05"
---

# drive +upload

> **PREREQUISITE:** Read `../gws-shared/SKILL.md` for auth, global flags, and security rules. If missing, run `gws generate-skills` to create it.

Upload a file with automatic metadata

## Usage

```bash
gws drive +upload <file>
```

## Flags

| Flag | Required | Default | Description |
|------|----------|---------|-------------|
| `<file>` | ✓ | — | Path to file to upload |
| `--parent` | — | — | Parent folder ID |
| `--name` | — | — | Target filename (defaults to source filename) |

## Examples

```bash
gws drive +upload ./report.pdf
gws drive +upload ./report.pdf --parent FOLDER_ID
gws drive +upload ./data.csv --name 'Sales Data.csv'
```

## Tips

- MIME type is detected automatically.
- Filename is inferred from the local path unless --name is given.

> [!CAUTION]
> This is a **write** command — confirm with the user before executing.

## See Also

- [gws-shared](../gws-shared/SKILL.md) — Global flags and auth
- [gws-drive](../gws-drive/SKILL.md) — All manage files, folders, and shared drives commands
