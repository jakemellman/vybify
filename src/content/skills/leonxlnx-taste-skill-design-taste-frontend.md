---
name: Design Taste Frontend
tagline: "Skill design-taste-frontend from leonxlnx/taste-skill."
url: "https://skills.sh/leonxlnx/taste-skill/design-taste-frontend"
github: "leonxlnx/taste-skill"
author: leonxlnx
tags:
  - "claude-code"
  - leonxlnx
kind: "claude-code-skill"
install: "npx skills add leonxlnx/taste-skill --skill design-taste-frontend"
addedAt: "2026-04-30"
---


<p align="center">
  <img src="assets/readme-banner.png" alt="Taste Skill — Anti-slop Agent Skills for premium frontends" width="100%" />
</p>

# Taste Skill

<p align="center">
  <em>The Anti-Slop Frontend Framework for AI Agents</em>
</p>

<p align="center">
  <a href="https://tasteskill.dev" title="Taste Skill — tasteskill.dev">
    <img src="assets/taste-skill-logo.webp" width="80" height="80" alt="Taste Skill" />
  </a>
</p>

<p align="center">
  <a href="https://tasteskill.dev">
    <img src="https://img.shields.io/badge/OPEN-tasteskill.dev-%23a855f7?style=for-the-badge&labelColor=%230f172a" alt="Open tasteskill.dev" />
  </a>
</p>

Portable **Agent Skills** that upgrade AI-built interfaces: stronger layout, typography, motion, and spacing instead of boilerplate-looking UIs. This repo also includes **image-generation skills** for reference boards (web, mobile, brand kits). Pair them with **ChatGPT Images** or similar generators, then hand the frames to Codex, Cursor, or Claude Code for implementation.

<p align="center">
<a href="https://github.com/Leonxlnx/taste-skill/stargazers"><img src="https://img.shields.io/github/stars/Leonxlnx/taste-skill?style=for-the-badge&logo=github&labelColor=1e293b&color=fbbf24" alt="GitHub stars"/></a>
<a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-fbbf24?style=for-the-badge&labelColor=1e293b" alt="MIT License"/></a>
<a href="#installing"><img src="https://img.shields.io/badge/Tools-Codex%20%C2%B7%20Cursor%20%C2%B7%20Claude-111827?style=for-the-badge&labelColor=1e293b" alt="Supported agents"/></a>
<a href="https://www.tasteskill.dev/changelog"><img src="https://img.shields.io/badge/Changelog-Latest-059669?style=for-the-badge&labelColor=1e293b" alt="Changelog on tasteskill.dev"/></a>
</p>

## Disclaimer

Taste Skill has no official token, coin, or crypto project. Any token using my name, image, or project is unaffiliated and not endorsed by me.

<p align="center"><sub><a href="#disclaimer">Disclaimer</a> · <a href="#installing">Install</a> · <a href="#skills">Skills</a> · <a href="#settings-taste-skill-only">Settings</a> · <a href="#examples">Examples</a> · <a href="#support-the-project">Sponsor</a> · <a href="#research">Research</a> · <a href="#common-questions">FAQ</a> · <a href="#license">License</a></sub></p>

## Feedback & Contributions

We would love your feedback. Suggestions and bug reports:

- Open a Pull Request or Issue on GitHub  
- DM [@lexnlin](https://x.com/lexnlin) or [@blueemi99](https://x.com/blueemi99)  
- Email us at [hello@tasteskill.dev](mailto:hello@tasteskill.dev)

## Installing

The [`npx skills add`](https://github.com/vercel-labs/agent-skills) CLI scans the `skills/` folder in this repo, so **all skills below (code and image-generation) install the same way.**

```bash
npx skills add https://github.com/Leonxlnx/taste-skill
```

Install a single skill by name (example):

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "imagegen-frontend-mobile"
```

You can also copy any `SKILL.md` into your project or paste it into ChatGPT / Codex conversations.

## Skills

Each skill does one job; you do not need all of them at once. **Implementation skills** output code. **Image-generation skills** output reference images only.

| Skill | Description |
| --- | --- |
| **taste-skill** | Default all-rounder for premium frontend output without locking one narrow visual style. |
| **gpt-taste** | Stricter variant for GPT/Codex: higher layout variance, stronger GSAP direction, aggressive anti-slop. |
| **image-to-code-skill** | Image-first pipeline: generate site references, analyze them, then implement the frontend to match. |
| **redesign-skill** | Existing projects: audit the UI first, then fix layout, spacing, hierarchy, styling. |
| **soft-skill** | Polished, calm, expensive UI with softer contrast, whitespace, premium fonts, spring motion. |
| **output-skill** | When the model ships half-finished work: full output, no placeholder comments. |
| **minimalist-skill** | Editorial product UI (Notion/Linear vibes), restrained palette, crisp structure. |
| **brutalist-skill** | ⚠️ `BETA` Hard mechanical language: Swiss type, sharp contrast, experimental layout. |
| **stitch-skill** | Google Stitch-compatible rules, including optional `DESIGN.md` export format. |

### Image generation skills

These produce design images only (no code). Use with ChatGPT Images, Codex image mode, or any agent that generates images.

[Read the full README on GitHub →](https://github.com/leonxlnx/taste-skill)
