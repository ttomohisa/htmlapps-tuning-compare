# APP_SPEC.md — Tuning Compare / 音律聞き比べ

## 1. Product identity

- **Name:** Tuning Compare / 音律聞き比べ
- **Version:** 0.5.0
- **Current milestone:** Mobile / Score UX
- **Purpose:** Make tuning comparison and short-score editing practical on smartphones without regressing the desktop workflow.
- **Release artifacts:** `dist/index.html`, `dist/index.self-extract.html`, and repository-root `tuning-compare.html`.

## 2. Template UI contract

The current `htmlapps-template` header, design tokens, page intro, dialog, toast, and responsive patterns remain the UI base.

For long smartphone workflows, v0.5.0 adopts the template's mobile bottom-bar / page-tab pattern.

## 3. Smartphone navigation

At widths up to 600 px, the app is divided into four pages:

- Compare
- Score
- Tuning
- Sound

The bottom bar:

- uses SVG icons plus text labels
- supports safe-area insets
- keeps state when switching pages
- does not change the desktop document-flow layout
- keeps only one smartphone page visible at a time

Desktop continues to show all sections normally.

## 4. Score layout on mobile

The two-measure score is not merely scaled down.

- desktop: both measures stay on one system
- smartphone: one measure per system, two systems vertically
- event selection targets are enlarged and vertically bounded around the notation
- the page itself must not gain horizontal scrolling
- tapping the staff remains eighth-note-step input

## 5. Mobile selected-event editor

When a score event is selected on smartphone:

- a fixed editor appears directly above the bottom navigation
- it shows the selected note/chord/rest
- duration can be changed from the fixed editor
- the selected event can be deleted
- score content gains enough bottom padding that the fixed editor does not hide content

No long-press interaction is required.

## 6. Undo affordance

Reversible destructive actions follow the template's Toast + Undo pattern.

- delete selected event → Toast with Undo
- clear score → Toast with Undo

No blocking confirmation dialog is required for these reversible actions.

## 7. Score playback

The v0.4.0 AudioContext-timed score playback remains unchanged in principle.

- Play A resolves notes through tuning slot A
- Play B resolves notes through tuning slot B
- cursor position derives from AudioContext time
- on mobile, the cursor moves between the first and second score systems correctly

## 8. Existing behavior retained

The following remain available:

- Audio Core
- equal temperament
- fixed 5-limit just intonation
- custom Hz tuning
- synchronized A/B comparison
- detailed tuning table
- arbitrary-frequency audition
- score editing
- score persistence
- Undo / Redo
- Japanese / English

## 9. Privacy and network

- no runtime fetch, XHR, WebSocket, CDN, analytics, telemetry, or remote font
- `connect-src 'none'`
- score data and generated audio remain local to the browser

## 10. Mobile acceptance criteria

Check at 320, 360, 390–393, and 430 px widths:

- no page-level horizontal scrolling
- fixed bottom bar does not hide content
- selected-event editor does not overlap the bottom bar
- score displays as two systems
- score can be tapped without requiring horizontal panning
- navigation labels fit without overflow
- dialog remains usable
- long note/chord labels do not break the page
- A/B, score, tuning, and sound state survive tab switching

## 11. General acceptance criteria

- desktop remains normal document flow
- template header and design language remain unchanged
- mobile page tabs use the template's bottom-bar conventions
- score selection and editing remain available without long press
- delete and clear are reversible via Undo Toast
- v0.4 score data survives reload
- v0.3 A/B comparison continues to work
- standalone build and repository checks pass

## 12. Remaining roadmap

- v0.6.0: WAV Export
- v0.7.0: Custom Tuning / Project Data
- v0.8.0: UX / Learning Support
- v0.9.0: Release Candidate
- v1.0.0: Formal Release
