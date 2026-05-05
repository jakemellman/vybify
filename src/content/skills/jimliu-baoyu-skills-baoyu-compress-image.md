---
name: Baoyu Compress Image
tagline: "Compresses images to WebP (default) or PNG with automatic tool selection. Use when user asks to \"compress image\", \"optimize image\", \"convert to webp\", or reduce"
url: "https://skills.sh/jimliu/baoyu-skills/baoyu-compress-image"
github: "jimliu/baoyu-skills"
author: jimliu
tags:
  - "claude-code"
  - jimliu
kind: "claude-code-skill"
install: "npx skills add jimliu/baoyu-skills --skill baoyu-compress-image"
addedAt: "2026-05-05"
---

# Image Compressor

Compresses images using best available tool (sips → cwebp → ImageMagick → Sharp).

## Script Directory

Scripts in `scripts/` subdirectory. `{baseDir}` = this SKILL.md's directory path. Resolve `${BUN_X}` runtime: if `bun` installed → `bun`; if `npx` available → `npx -y bun`; else suggest installing bun. Replace `{baseDir}` and `${BUN_X}` with actual values.

| Script | Purpose |
|--------|---------|
| `scripts/main.ts` | Image compression CLI |

## Preferences (EXTEND.md)

Check EXTEND.md in priority order — the first one found wins:

| Priority | Path | Scope |
|----------|------|-------|
| 1 | `.baoyu-skills/baoyu-compress-image/EXTEND.md` | Project |
| 2 | `${XDG_CONFIG_HOME:-$HOME/.config}/baoyu-skills/baoyu-compress-image/EXTEND.md` | XDG |
| 3 | `$HOME/.baoyu-skills/baoyu-compress-image/EXTEND.md` | User home |

If none found, use defaults.

**EXTEND.md supports**: Default format, default quality, keep-original preference.

## Usage

```bash
${BUN_X} {baseDir}/scripts/main.ts <input> [options]
```

## Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `<input>` | | File or directory | Required |
| `--output` | `-o` | Output path | Same path, new ext |
| `--format` | `-f` | webp, png, jpeg | webp |
| `--quality` | `-q` | Quality 0-100 | 80 |
| `--keep` | `-k` | Keep original | false |
| `--recursive` | `-r` | Process subdirs | false |
| `--json` | | JSON output | false |

## Examples

```bash
# Single file → WebP (replaces original)
${BUN_X} {baseDir}/scripts/main.ts image.png

# Keep PNG format
${BUN_X} {baseDir}/scripts/main.ts image.png -f png --keep

# Directory recursive
${BUN_X} {baseDir}/scripts/main.ts ./images/ -r -q 75

# JSON output
${BUN_X} {baseDir}/scripts/main.ts image.png --json
```

**Output**:
```
image.png → image.webp (245KB → 89KB, 64% reduction)
```

## Extension Support

Custom configurations via EXTEND.md. See **Preferences** section for paths and supported options.
