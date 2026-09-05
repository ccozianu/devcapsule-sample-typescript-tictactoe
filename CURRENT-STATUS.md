# Open Workstreams Registry

Workflow type: `multiple-streams`

Authority: Mainline registry for active, paused, blocked, and integrating workstreams.
Detailed handoff state lives in each workstream's `CURRENT-STATUS.md`.

## Open Workstreams

| Mnemonic | Start Date | State | Branch Association | Handoff | Goal |
|---|---|---|---|---|---|
| `project-management` | 2026-09-02 | `active; permanent coordination` | `project-management/coordination` | [CURRENT-STATUS.md](engineering-docs/wip/2026-09-02-project-management/CURRENT-STATUS.md) | Portfolio coordination, priorities, sequencing, lifecycle governance, and unowned intake routing. |
| `gameplay-enhancements` | 2026-09-02 | `paused` | `gameplay-enhancements/ai-and-history` | [CURRENT-STATUS.md](engineering-docs/wip/2026-09-02-gameplay-enhancements/CURRENT-STATUS.md) | Implement single-player AI mode, move history with undo/redo capability, and configurable board/win parameters. |
| `ui-polish` | 2026-09-02 | `paused` | `ui-polish/responsive-grid` | [CURRENT-STATUS.md](engineering-docs/wip/2026-09-02-ui-polish/CURRENT-STATUS.md) | Enhance UI/UX, responsive board controls (pan/zoom for 30×30 grid), cell styling, turn indicators, and accessibility. |

## Notes

- `project-management` is permanent for the lifetime of `multiple-streams` mode.
- `test-infra` concluded and integrated into mainline on 2026-09-02; archived at [engineering-docs/archive/2026-09-02-test-infra/CURRENT-STATUS.md](engineering-docs/archive/2026-09-02-test-infra/CURRENT-STATUS.md).
