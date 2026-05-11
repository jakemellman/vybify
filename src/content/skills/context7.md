---
name: Context7
tagline: "Up-to-date code documentation for any library, fed straight into your LLM via MCP."
url: "https://context7.com"
github: upstash/context7
author: Upstash
tags:
  - mcp
  - docs
  - context
kind: "mcp-server"
install: "claude mcp add context7 -- npx -y @upstash/context7-mcp"
featured: true
starter: true
addedAt: "2026-04-28"
---


# Context7 Platform - Up-to-date Code Docs For Any Prompt

[![Website](https://img.shields.io/badge/Website-context7.com-blue)](https://context7.com) [![smithery badge](https://smithery.ai/badge/@upstash/context7-mcp)](https://smithery.ai/server/@upstash/context7-mcp) [![NPM Version](https://img.shields.io/npm/v/%40upstash%2Fcontext7-mcp?color=red)](https://www.npmjs.com/package/@upstash/context7-mcp) [![MIT licensed](https://img.shields.io/npm/l/%40upstash%2Fcontext7-mcp)](./LICENSE)

[![繁體中文](https://img.shields.io/badge/docs-繁體中文-yellow)](./i18n/README.zh-TW.md) [![简体中文](https://img.shields.io/badge/docs-简体中文-yellow)](./i18n/README.zh-CN.md) [![日本語](https://img.shields.io/badge/docs-日本語-b7003a)](./i18n/README.ja.md) [![한국어 문서](https://img.shields.io/badge/docs-한국어-green)](./i18n/README.ko.md) [![Documentación en Español](https://img.shields.io/badge/docs-Español-orange)](./i18n/README.es.md) [![Documentation en Français](https://img.shields.io/badge/docs-Français-blue)](./i18n/README.fr.md) [![Documentação em Português (Brasil)](https://raw.githubusercontent.com/upstash/context7/HEAD/&lt;https://img.shields.io/badge/docs-Português%20(Brasil)-purple&gt;)](./i18n/README.pt-BR.md) [![Documentazione in italiano](https://img.shields.io/badge/docs-Italian-red)](./i18n/README.it.md) [![Dokumentasi Bahasa Indonesia](https://img.shields.io/badge/docs-Bahasa%20Indonesia-pink)](./i18n/README.id-ID.md) [![Dokumentation auf Deutsch](https://img.shields.io/badge/docs-Deutsch-darkgreen)](./i18n/README.de.md) [![Документация на русском языке](https://img.shields.io/badge/docs-Русский-darkblue)](./i18n/README.ru.md) [![Українська документація](https://img.shields.io/badge/docs-Українська-lightblue)](./i18n/README.uk.md) [![Türkçe Doküman](https://img.shields.io/badge/docs-Türkçe-blue)](./i18n/README.tr.md) [![Arabic Documentation](https://img.shields.io/badge/docs-Arabic-white)](./i18n/README.ar.md) [![Tiếng Việt](https://img.shields.io/badge/docs-Tiếng%20Việt-red)](./i18n/README.vi.md)

## ❌ Without Context7

LLMs rely on outdated or generic information about the libraries you use. You get:

- ❌ Code examples are outdated and based on year-old training data
- ❌ Hallucinated APIs that don't even exist
- ❌ Generic answers for old package versions

## ✅ With Context7

Context7 pulls up-to-date, version-specific documentation and code examples straight from the source — and places them directly into your prompt.

```txt
Create a Next.js middleware that checks for a valid JWT in cookies
and redirects unauthenticated users to `/login`. use context7
```

```txt
Configure a Cloudflare Worker script to cache
JSON API responses for five minutes. use context7
```

```txt
Show me the Supabase auth API for email/password sign-up.
```

Context7 fetches up-to-date code examples and documentation right into your LLM's context. No tab-switching, no hallucinated APIs that don't exist, no outdated code generation.

Works in two modes:

- **CLI + Skills** — installs a skill that guides your agent to fetch docs using `ctx7` CLI commands (no MCP required)
- **MCP** — registers a Context7 MCP server so your agent can call documentation tools natively

## Installation

> [!NOTE]
> **API Key Recommended**: Get a free API key at [context7.com/dashboard](https://context7.com/dashboard) for higher rate limits.

Set up Context7 for your coding agents with a single command:

```bash
npx ctx7 setup
```

Authenticates via OAuth, generates an API key, and installs the appropriate skill. You can choose between CLI + Skills or MCP mode. Use `--cursor`, `--claude`, or `--opencode` to target a specific agent.

To remove the generated setup later, run `npx ctx7 remove`. If you globally installed the CLI with `npm install -g ctx7`, remove that package separately with `npm uninstall -g ctx7`.

To configure manually, use the Context7 server URL `https://mcp.context7.com/mcp` with your MCP client and pass your API key via the `CONTEXT7_API_KEY` header. See the link below for client-specific setup instructions.

**[Manual Installation / Other Clients →](https://context7.com/docs/resources/all-clients)**

## Important Tips

### Use Library Id

If you already know exactly which library you want to use, add its Context7 ID to your prompt. That way, Context7 can skip the library-matching step and directly retrieve docs.

```txt
Implement basic authentication with Supabase. use library /supabase/supabase for API and docs.
```

[Read the full README on GitHub →](https://github.com/upstash/context7)
