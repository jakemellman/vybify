---
name: Recipe Compare Sheet Tabs
tagline: Read data from two tabs in a Google Sheet to compare and identify differences.
url: "https://skills.sh/googleworkspace/cli/recipe-compare-sheet-tabs"
github: googleworkspace/cli
author: googleworkspace
tags:
  - "claude-code"
  - googleworkspace
kind: "claude-code-skill"
install: "npx skills add googleworkspace/cli --skill recipe-compare-sheet-tabs"
addedAt: "2026-05-05"
---

# Compare Two Google Sheets Tabs

> **PREREQUISITE:** Load the following skills to execute this recipe: `gws-sheets`

Read data from two tabs in a Google Sheet to compare and identify differences.

## Steps

1. Read the first tab: `gws sheets +read --spreadsheet SHEET_ID --range "January!A1:D"`
2. Read the second tab: `gws sheets +read --spreadsheet SHEET_ID --range "February!A1:D"`
3. Compare the data and identify changes
