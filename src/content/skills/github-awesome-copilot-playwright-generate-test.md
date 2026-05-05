---
name: Playwright Generate Test
tagline: Generate a Playwright test based on a scenario using Playwright MCP
url: "https://skills.sh/github/awesome-copilot/playwright-generate-test"
github: "github/awesome-copilot"
author: github
tags:
  - "claude-code"
  - github
kind: "claude-code-skill"
install: "npx skills add github/awesome-copilot --skill playwright-generate-test"
addedAt: "2026-05-05"
---

# Test Generation with Playwright MCP

Your goal is to generate a Playwright test based on the provided scenario after completing all prescribed steps.

## Specific Instructions

- You are given a scenario, and you need to generate a playwright test for it. If the user does not provide a scenario, you will ask them to provide one.
- DO NOT generate test code prematurely or based solely on the scenario without completing all prescribed steps.
- DO run steps one by one using the tools provided by the Playwright MCP.
- Only after all steps are completed, emit a Playwright TypeScript test that uses `@playwright/test` based on message history
- Save generated test file in the tests directory
- Execute the test file and iterate until the test passes
