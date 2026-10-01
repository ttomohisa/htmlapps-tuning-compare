# APP_SPEC.md — Tuning Compare / 音律聞き比べ

## 1. Product identity

- **Name:** Tuning Compare / 音律聞き比べ
- **Version:** 0.4.0
- **Current milestone:** Score Editor MVP
- **Purpose:** Create a short score and hear the same notes with tuning A or B while preserving the v0.3 A/B comparison workflow.
- **Release artifacts:** `dist/index.html`, `dist/index.self-extract.html`, and repository-root `tuning-compare.html`.

## 2. Template UI contract

The current `htmlapps-template` header, design tokens, page intro, dialogs, toast, spacing, cards, and responsive patterns remain the UI base. App-specific score UI extends those tokens rather than replacing the design system.

## 3. Score scope

v0.4.0 intentionally provides a compact score editor rather than a full notation application.

- two measures
- treble staff
- 4/4 and 3/4
- BPM 30–300
- whole, half, quarter, and eighth durations
- note input
- rest input
- flat, natural, and sharp input
- chords by adding multiple pitches at the same start position
- event selection and deletion
- Undo / Redo with up to 30 history snapshots
- playback cursor
- playback using tuning A or tuning B

No ties, tuplets, dynamics, multiple parts, lyrics, MIDI import, or engraving-grade layout are required in v0.4.0.

## 4. Input model

The staff represents two measures and snaps horizontally to eighth-note positions. Vertical input maps to natural staff steps from C4 through C6. The selected accidental converts that staff step to a concrete enharmonic note used by the tuning engine.

Adding a note at an occupied start position appends the pitch to that event and creates a chord. Rest input replaces the event at that position with a rest.

## 5. Score data

Each event contains a stable numeric id, `start` in beats, `duration` in beats, `rest`, and `notes[]` with normalized note, display spelling, and accidental.

## 6. Playback

- Score playback schedules notes on the Web Audio timeline rather than chaining UI timers.
- Play A resolves every pitch through tuning slot A.
- Play B resolves every pitch through tuning slot B.
- Rests schedule no oscillators.
- Playback cursor derives from `AudioContext.currentTime`.
- Stop releases scheduled/active voices and clears the cursor.
- Existing timbre, volume, attack, and release settings apply.

## 7. Existing behavior

v0.1 Audio Core, v0.2 Tuning Engine, and v0.3 synchronized A/B comparison remain available without feature removal.

## 8. Persistence

Persist score events, tempo, time signature, A/B tuning configuration, detailed tuning configuration, manual audition settings, and language. Undo/Redo history and live audio objects are not persisted.

## 9. Privacy

No runtime fetch, XHR, WebSocket, CDN, analytics, telemetry, or remote font. `connect-src 'none'` remains required. Score data and generated audio stay in the browser.

## 10. Mobile / accessibility baseline

- no page-level horizontal scrolling
- SVG score scales to container width
- score can be entered by pointer/touch
- input modes and durations use text plus pressed state, not color alone
- selected event has a visible outline and readable text summary
- Delete / Backspace and Ctrl/Cmd+Z/Y are available on keyboard
- full mobile score UX polish remains v0.5.0

## 11. Acceptance criteria

- current template header/design remains intact
- click/tap adds a note snapped to an eighth-note position
- another pitch at the same position creates a chord
- rest input creates a rest event
- all four required durations are available
- 3/4 and 4/4 are supported
- tempo is editable from 30–300 BPM
- Undo and Redo restore edits
- selected events can be deleted
- Play A and Play B use the corresponding tuning slot
- a playback cursor moves during playback
- score survives reload through local persistence
- v0.3 A/B comparison continues to work
- standalone build, CSP, icon, and template validation remain green

## 12. Remaining roadmap

- v0.5.0: Mobile / Score UX
- v0.6.0: WAV Export
- v0.7.0: Custom Tuning / Project Data
- v0.8.0: UX / Learning Support
- v0.9.0: Release Candidate
- v1.0.0: Formal Release
