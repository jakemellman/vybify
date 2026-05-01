---
name: FastMCP
tagline: "The fast, Pythonic way to build MCP servers and clients."
url: "https://gofastmcp.com"
github: jlowin/fastmcp
author: Jeremiah Lowin
tags:
  - mcp
  - python
  - framework
kind: "mcp-server"
install: pip install fastmcp
addedAt: "2026-04-28"
---


<!-- omit in toc -->

<picture>
  <source width="550" media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/PrefectHQ/fastmcp/main/docs/assets/brand/f-watercolor-waves-4-dark.png">
  <source width="550" media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/PrefectHQ/fastmcp/main/docs/assets/brand/f-watercolor-waves-4.png">
  <img width="550" alt="FastMCP Logo" src="https://raw.githubusercontent.com/PrefectHQ/fastmcp/main/docs/assets/brand/f-watercolor-waves-2.png">
</picture>

# FastMCP 🚀

<strong>Move fast and make things.</strong>

*Made with 💙 by [Prefect](https://www.prefect.io/)*

[![Docs](https://img.shields.io/badge/docs-gofastmcp.com-blue)](https://gofastmcp.com)
[![Discord](https://img.shields.io/badge/community-discord-5865F2?logo=discord&logoColor=white)](https://discord.gg/uu8dJCgttd)
[![PyPI - Version](https://img.shields.io/pypi/v/fastmcp.svg)](https://pypi.org/project/fastmcp)
[![Tests](https://github.com/PrefectHQ/fastmcp/actions/workflows/run-tests.yml/badge.svg)](https://github.com/PrefectHQ/fastmcp/actions/workflows/run-tests.yml)
[![License](https://img.shields.io/github/license/PrefectHQ/fastmcp.svg)](https://github.com/PrefectHQ/fastmcp/blob/main/LICENSE)

<a href="https://trendshift.io/repositories/13266" target="_blank"><img src="https://trendshift.io/api/badge/repositories/13266" alt="prefecthq%2Ffastmcp | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>
</div>

---

The [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) connects LLMs to tools and data. FastMCP gives you everything you need to go from prototype to production:

```python
from fastmcp import FastMCP

mcp = FastMCP("Demo 🚀")

@mcp.tool
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b

if __name__ == "__main__":
    mcp.run()
```

## Why FastMCP

Building an effective MCP application is harder than it looks. FastMCP handles all of it. Declare a tool with a Python function, and the schema, validation, and documentation are generated automatically. Connect to a server with a URL, and transport negotiation, authentication, and protocol lifecycle are managed for you. You focus on your logic, and the MCP part just works: **with FastMCP, best practices are built in.**

**That's why FastMCP is the standard framework for working with MCP.** FastMCP 1.0 was incorporated into the official MCP Python SDK in 2024. Today, the actively maintained standalone project is downloaded a million times a day, and some version of FastMCP powers 70% of MCP servers across all languages.

FastMCP has three pillars:

<table>
<tr>
<td align="center" valign="top" width="33%">
<a href="https://gofastmcp.com/servers/server">
<img src="https://raw.githubusercontent.com/PrefectHQ/fastmcp/main/docs/assets/images/servers-card.png" alt="Servers" />
<br /><strong>Servers</strong>
</a>
<br />Expose tools, resources, and prompts to LLMs.
</td>
<td align="center" valign="top" width="33%">
<a href="https://gofastmcp.com/apps/overview">
<img src="https://raw.githubusercontent.com/PrefectHQ/fastmcp/main/docs/assets/images/apps-card.png" alt="Apps" />
<br /><strong>Apps</strong>
</a>
<br />Give your tools interactive UIs rendered directly in the conversation.
</td>
<td align="center" valign="top" width="33%">
<a href="https://gofastmcp.com/clients/client">
<img src="https://raw.githubusercontent.com/PrefectHQ/fastmcp/main/docs/assets/images/clients-card.png" alt="Clients" />
<br /><strong>Clients</strong>
</a>
<br />Connect to any MCP server — local or remote, programmatic or CLI.
</td>
</tr>
</table>

**[Servers](https://gofastmcp.com/servers/server)** wrap your Python functions into MCP-compliant tools, resources, and prompts. **[Clients](https://gofastmcp.com/clients/client)** connect to any server with full protocol support. And **[Apps](https://gofastmcp.com/apps/overview)** give your tools interactive UIs rendered directly in the conversation.

Ready to build? Start with the [installation guide](https://gofastmcp.com/getting-started/installation) or jump straight to the [quickstart](https://gofastmcp.com/getting-started/quickstart).

## Run FastMCP in production with Horizon

FastMCP is the standard way to build MCP servers. **[Prefect Horizon](https://www.prefect.io/horizon?utm_source=github&utm_medium=readme&utm_campaign=readme_horizon&utm_content=readme_body)** is the enterprise MCP gateway for running them safely.

[Read the full README on GitHub →](https://github.com/jlowin/fastmcp)
