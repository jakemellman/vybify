---
name: Official MCP Servers
tagline: "Reference implementations of Model Context Protocol servers — filesystem, github, postgres, more."
url: "https://github.com/modelcontextprotocol/servers"
github: modelcontextprotocol/servers
author: Anthropic
tags:
  - mcp
  - reference
  - server
kind: "mcp-server"
featured: true
addedAt: "2026-04-28"
---


# Model Context Protocol servers

This repository is a collection of *reference implementations* for the [Model Context Protocol](https://modelcontextprotocol.io/) (MCP), as well as references to community-built servers and additional resources.

> [!IMPORTANT]
> If you are looking for a list of MCP servers, you can browse published servers on [the MCP Registry](https://registry.modelcontextprotocol.io/). The repository served by this README is dedicated to housing just the small number of reference servers maintained by the MCP steering group.

> [!WARNING]
> The servers in this repository are intended as **reference implementations** to demonstrate MCP features and SDK usage. They are meant to serve as educational examples for developers building their own MCP servers, not as production-ready solutions. Developers should evaluate their own security requirements and implement appropriate safeguards based on their specific threat model and use case.

The servers in this repository showcase the versatility and extensibility of MCP, demonstrating how it can be used to give Large Language Models (LLMs) secure, controlled access to tools and data sources.
Typically, each MCP server is implemented with an MCP SDK:

- [C# MCP SDK](https://github.com/modelcontextprotocol/csharp-sdk)
- [Go MCP SDK](https://github.com/modelcontextprotocol/go-sdk)
- [Java MCP SDK](https://github.com/modelcontextprotocol/java-sdk)
- [Kotlin MCP SDK](https://github.com/modelcontextprotocol/kotlin-sdk)
- [PHP MCP SDK](https://github.com/modelcontextprotocol/php-sdk)
- [Python MCP SDK](https://github.com/modelcontextprotocol/python-sdk)
- [Ruby MCP SDK](https://github.com/modelcontextprotocol/ruby-sdk)
- [Rust MCP SDK](https://github.com/modelcontextprotocol/rust-sdk)
- [Swift MCP SDK](https://github.com/modelcontextprotocol/swift-sdk)
- [TypeScript MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## 🌟 Reference Servers

These servers aim to demonstrate MCP features and the official SDKs.

- **[Everything](https://github.com/modelcontextprotocol/servers/blob/HEAD/src/everything)** - Reference / test server with prompts, resources, and tools.
- **[Fetch](https://github.com/modelcontextprotocol/servers/blob/HEAD/src/fetch)** - Web content fetching and conversion for efficient LLM usage.
- **[Filesystem](https://github.com/modelcontextprotocol/servers/blob/HEAD/src/filesystem)** - Secure file operations with configurable access controls.
- **[Git](https://github.com/modelcontextprotocol/servers/blob/HEAD/src/git)** - Tools to read, search, and manipulate Git repositories.
- **[Memory](https://github.com/modelcontextprotocol/servers/blob/HEAD/src/memory)** - Knowledge graph-based persistent memory system.
- **[Sequential Thinking](https://github.com/modelcontextprotocol/servers/blob/HEAD/src/sequentialthinking)** - Dynamic and reflective problem-solving through thought sequences.
- **[Time](https://github.com/modelcontextprotocol/servers/blob/HEAD/src/time)** - Time and timezone conversion capabilities.

### Archived

The following reference servers are now archived and can be found at [servers-archived](https://github.com/modelcontextprotocol/servers-archived).

[Read the full README on GitHub →](https://github.com/modelcontextprotocol/servers)
