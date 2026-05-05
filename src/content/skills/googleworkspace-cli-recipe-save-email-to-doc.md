---
name: Recipe Save Email To Doc
tagline: Save a Gmail message body into a Google Doc for archival or reference.
url: "https://skills.sh/googleworkspace/cli/recipe-save-email-to-doc"
github: googleworkspace/cli
author: googleworkspace
tags:
  - "claude-code"
  - googleworkspace
kind: "claude-code-skill"
install: "npx skills add googleworkspace/cli --skill recipe-save-email-to-doc"
addedAt: "2026-05-05"
---

# Save a Gmail Message to Google Docs

> **PREREQUISITE:** Load the following skills to execute this recipe: `gws-gmail`, `gws-docs`

Save a Gmail message body into a Google Doc for archival or reference.

## Steps

1. Find the message: `gws gmail users messages list --params '{"userId": "me", "q": "subject:important from:boss@company.com"}' --format table`
2. Get message content: `gws gmail users messages get --params '{"userId": "me", "id": "MSG_ID"}'`
3. Create a doc with the content: `gws docs documents create --json '{"title": "Saved Email - Important Update"}'`
4. Write the email body: `gws docs +write --document-id DOC_ID --text 'From: boss@company.com
Subject: Important Update

[EMAIL BODY]'`
