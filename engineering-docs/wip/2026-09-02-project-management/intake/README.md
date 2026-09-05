# Project Management Intake Queue

This directory receives tasks, cross-cutting routing requests, and unowned work forwarded from other workstreams or submitted by the human.

Per `WORKFLOW.md`:
- Each item is named `YYYY-MM-DD-<sender-mnemonic>-<slug>.md`.
- `project-management` dispositions items by acknowledging, forwarding to an ordinary workstream, spawning a new workstream, or rejecting with documented rationale.
- Dispositions are recorded in `../intake-dispositions.md` and deleted from here in the same delivery.
