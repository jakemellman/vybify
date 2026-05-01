---
name: Typescript Advanced Types
tagline: "Skill typescript-advanced-types from wshobson/agents."
url: "https://skills.sh/wshobson/agents/typescript-advanced-types"
github: wshobson/agents
author: wshobson
tags:
  - "claude-code"
  - wshobson
kind: "claude-code-skill"
install: "npx skills add wshobson/agents --skill typescript-advanced-types"
addedAt: "2026-04-30"
---


# Claude Code Plugins: Orchestration and Automation

> **⚡ Updated for Opus 4.7, Sonnet 4.6 & Haiku 4.5** — Three-tier model strategy for optimal performance

[![Run in Smithery](https://smithery.ai/badge/skills/wshobson)](https://smithery.ai/skills?ns=wshobson&utm_source=github&utm_medium=badge)

> **🎯 Agent Skills Enabled** — 150 specialized skills extend Claude's capabilities across plugins with progressive disclosure

A comprehensive production-ready system combining **184 specialized AI agents**, **16 multi-agent workflow orchestrators**, **150 agent skills**, and **98 commands** organized into **78 focused, single-purpose plugins** for [Claude Code](https://docs.claude.com/en/docs/claude-code/overview).

## Overview

This unified repository provides everything needed for intelligent automation and multi-agent orchestration across modern software development:

- **78 Focused Plugins** - Granular, single-purpose plugins optimized for minimal token usage and composability
- **184 Specialized Agents** - Domain experts with deep knowledge across architecture, languages, infrastructure, quality, data/AI, documentation, business operations, and SEO
- **150 Agent Skills** - Modular knowledge packages with progressive disclosure for specialized expertise
- **16 Workflow Orchestrators** - Multi-agent coordination systems for complex operations like full-stack development, security hardening, ML pipelines, and incident response
- **98 Commands** - Optimized utilities including project scaffolding, security scanning, test automation, and infrastructure setup

### Key Features

- **Granular Plugin Architecture**: 78 focused plugins optimized for minimal token usage
- **Comprehensive Tooling**: 98 commands including test generation, scaffolding, and security scanning
- **100% Agent Coverage**: All plugins include specialized agents
- **Agent Skills**: 150 specialized skills following for progressive disclosure and token efficiency
- **Clear Organization**: 25 categories with 1-10 plugins each for easy discovery
- **Efficient Design**: Average 3.6 components per plugin (follows Anthropic's 2-8 pattern)

### How It Works

Each plugin is completely isolated with its own agents, commands, and skills:

- **Install only what you need** - Each plugin loads only its specific agents, commands, and skills
- **Minimal token usage** - No unnecessary resources loaded into context
- **Mix and match** - Compose multiple plugins for complex workflows
- **Clear boundaries** - Each plugin has a single, focused purpose
- **Progressive disclosure** - Skills load knowledge only when activated

**Example**: Installing `python-development` loads 3 Python agents, 1 scaffolding tool, and makes 16 skills available (~1000 tokens), not the entire marketplace.

## Quick Start

### Step 1: Add the Marketplace

Add this marketplace to Claude Code:

```bash
/plugin marketplace add wshobson/agents
```

This makes all 78 plugins available for installation, but **does not load any agents or tools** into your context.

### Step 2: Install Plugins

Browse available plugins:

```bash
/plugin
```

Install the plugins you need:

```bash
# Essential development plugins
/plugin install python-development          # Python with 16 specialized skills
/plugin install javascript-typescript       # JS/TS with 4 specialized skills
/plugin install backend-development         # Backend APIs with 3 architecture skills

# Infrastructure & operations
/plugin install kubernetes-operations       # K8s with 4 deployment skills
/plugin install cloud-infrastructure        # AWS/Azure/GCP with 4 cloud skills

# Security & quality
/plugin install security-scanning           # SAST with security skill
/plugin install comprehensive-review       # Multi-perspective code analysis

# Full-stack orchestration
/plugin install full-stack-orchestration   # Multi-agent workflows
```

Each installed plugin loads **only its specific agents, commands, and skills** into Claude's context.

### Plugins vs Agents

You install **plugins**, which bundle agents:

[Read the full README on GitHub →](https://github.com/wshobson/agents)
