---
name: Recipe Watch Drive Changes
tagline: Subscribe to change notifications on a Google Drive file or folder.
url: "https://skills.sh/googleworkspace/cli/recipe-watch-drive-changes"
github: googleworkspace/cli
author: googleworkspace
tags:
  - "claude-code"
  - googleworkspace
kind: "claude-code-skill"
install: "npx skills add googleworkspace/cli --skill recipe-watch-drive-changes"
addedAt: "2026-05-05"
---

# Watch for Drive Changes

> **PREREQUISITE:** Load the following skills to execute this recipe: `gws-events`

Subscribe to change notifications on a Google Drive file or folder.

## Steps

1. Create subscription: `gws events subscriptions create --json '{"targetResource": "//drive.googleapis.com/drives/DRIVE_ID", "eventTypes": ["google.workspace.drive.file.v1.updated"], "notificationEndpoint": {"pubsubTopic": "projects/PROJECT/topics/TOPIC"}, "payloadOptions": {"includeResource": true}}'`
2. List active subscriptions: `gws events subscriptions list`
3. Renew before expiry: `gws events +renew --subscription SUBSCRIPTION_ID`
