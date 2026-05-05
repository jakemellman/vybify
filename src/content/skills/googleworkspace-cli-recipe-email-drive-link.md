---
name: Recipe Email Drive Link
tagline: Share a Google Drive file and email the link with a message to recipients.
url: "https://skills.sh/googleworkspace/cli/recipe-email-drive-link"
github: googleworkspace/cli
author: googleworkspace
tags:
  - "claude-code"
  - googleworkspace
kind: "claude-code-skill"
install: "npx skills add googleworkspace/cli --skill recipe-email-drive-link"
addedAt: "2026-05-05"
---

# Email a Google Drive File Link

> **PREREQUISITE:** Load the following skills to execute this recipe: `gws-drive`, `gws-gmail`

Share a Google Drive file and email the link with a message to recipients.

## Steps

1. Find the file: `gws drive files list --params '{"q": "name = '\''Quarterly Report'\''"}'`
2. Share the file: `gws drive permissions create --params '{"fileId": "FILE_ID"}' --json '{"role": "reader", "type": "user", "emailAddress": "client@example.com"}'`
3. Email the link: `gws gmail +send --to client@example.com --subject 'Quarterly Report' --body 'Hi, please find the report here: https://docs.google.com/document/d/FILE_ID'`
