---
name: Recipe Review Meet Participants
tagline: Review who attended a Google Meet conference and for how long.
url: "https://skills.sh/googleworkspace/cli/recipe-review-meet-participants"
github: googleworkspace/cli
author: googleworkspace
tags:
  - "claude-code"
  - googleworkspace
kind: "claude-code-skill"
install: "npx skills add googleworkspace/cli --skill recipe-review-meet-participants"
addedAt: "2026-05-05"
---

# Review Google Meet Attendance

> **PREREQUISITE:** Load the following skills to execute this recipe: `gws-meet`

Review who attended a Google Meet conference and for how long.

## Steps

1. List recent conferences: `gws meet conferenceRecords list --format table`
2. List participants: `gws meet conferenceRecords participants list --params '{"parent": "conferenceRecords/CONFERENCE_ID"}' --format table`
3. Get session details: `gws meet conferenceRecords participants participantSessions list --params '{"parent": "conferenceRecords/CONFERENCE_ID/participants/PARTICIPANT_ID"}' --format table`
