# APP_SPEC.md — Tuning Compare / 音律聞き比べ

## 1. Product identity

- **Name:** Tuning Compare / 音律聞き比べ
- **Version:** 0.2.0
- **Current milestone:** Tuning Engine
- **Purpose:** Let users see and hear the exact frequencies produced by equal temperament, a defined 5-limit just-intonation preset, or direct custom Hz values before the later A/B and score workflows are added.
- **Primary users:** Musicians, music learners, and people exploring tuning and pitch relationships.
- **Release artifacts:** `dist/index.html`, `dist/index.self-extract.html`, and repository-root `tuning-compare.html`.

## 2. v0.2.0 outcome

The v0.1.0 arbitrary-frequency Audio Core remains intact. v0.2.0 adds a tuning calculation layer that maps note names to exact frequencies and lets the user audition the result immediately.

## 3. Supported tuning modes

### 12-tone equal temperament

For MIDI note `m`, reference MIDI note `r`, and reference frequency `f`:

`frequency = f * 2^((m-r)/12)`

The default reference is A4 = 440.000 Hz. The reference note can be any chromatic note from C4 through B4 and its frequency can be 20–20,000 Hz.

### 5-limit just intonation

Use the following pitch-class ratios from the selected tonic:

`1/1, 16/15, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5, 5/3, 9/5, 15/8`

The user chooses the tonic from C through B. The complete tuning is scaled so the selected reference note remains exactly at the selected reference frequency.

The UI and help must not imply that every possible chord becomes perfectly just. The preset is a concrete fixed ratio table relative to the selected tonic.

### Custom

- C4–B4 are directly editable in Hz.
- Other octaves are generated at 2:1 from the same pitch class.
- C5 is shown as a derived value (`C4 * 2`) and is not independently editable in v0.2.0.
- Selecting Custom directly initializes missing custom values from current equal temperament.
- “Copy current values to Custom” copies the current selected tuning's C4–B4 frequencies, then switches to Custom.
- In Custom mode, reference-note and reference-frequency controls are disabled because direct Hz values are authoritative.

## 4. Frequency table

Show C4 through C5 with:

- note name
- actual frequency to three decimal places
- tonic ratio for just intonation
- cents difference from equal temperament using the same reference pitch
- per-note audition button

For equal temperament the cents difference is zero by definition. For Custom it is calculated from the direct Hz value against equal temperament.

## 5. Audio Core retained from v0.1.0

- Web Audio API only; no runtime dependencies.
- Arbitrary frequency audition from 20–20,000 Hz.
- Four visible manual chord frequencies.
- Engine maximum of 16 oscillator voices.
- Sine, Soft harmonics, Rich harmonics.
- Soft harmonics: fundamental 1.0; harmonics 2..6 = 0.18, 0.07, 0.03, 0.015, 0.007.
- Master volume, attack, release.
- Starting a new preview releases previous voices.
- Stop releases all active voices.

Quick-note buttons (C4, E4, G4, A4) must now use the currently selected tuning rather than hard-coded equal-temperament values.

## 6. State and persistence

Persist locally when available:

- language
- tuningType
- referenceNote
- referenceFrequency
- tonic
- customFrequencies C4–B4
- v0.1.0 manual-audition settings

Use a stable `${slug}:settings` key. Read the previous `${slug}:v0.1.0-settings` key as a one-way compatibility fallback.

Audio runtime objects remain non-serializable and are never persisted.

## 7. Privacy and network

- No runtime fetch, XHR, WebSocket, CDN, analytics, telemetry, or remote font.
- `connect-src 'none'` remains required.
- All frequency calculation and audio generation occurs in the browser.

## 8. Accessibility and mobile

- 320 px minimum width.
- Tuning controls wrap to two columns on narrow screens.
- Frequency table may scroll horizontally inside its own bordered region; it must not make the page itself horizontally scroll.
- Every editable frequency has an accessible note-specific label.
- Per-note audition buttons include the note name in the accessible label.
- Controls that are irrelevant to the selected tuning are disabled, not merely visually dimmed.
- Help remains scrollable on short smartphone viewports.

## 9. Validation and error handling

- Reference frequency: 20–20,000 Hz.
- Custom frequencies: 20–20,000 Hz each.
- Invalid custom values stay visibly invalid and must not overwrite the last valid stored value.
- Audio errors remain user-readable.

## 10. Acceptance criteria

- Default equal temperament returns A4 exactly 440 Hz and C4 approximately 261.626 Hz.
- With tonic C and a reference scaled consistently, just-intonation pitch classes use the specified ratio table.
- For tonic C, C–E ratio is 5/4 and C–G ratio is 3/2.
- Custom C4 can be changed to an arbitrary valid value and C5 becomes exactly twice that value.
- Quick-note audition follows the selected tuning.
- Copy-to-Custom preserves the current C4–B4 frequencies to numerical precision shown by the UI.
- v0.1.0 manual audition and timbre controls continue to work.
- No third-party runtime dependency is added.
- Template placeholders/icon/network/component markers remain valid.

## 11. Remaining roadmap

- v0.3.0: A/B Compare
- v0.4.0: Score Editor MVP
- v0.5.0: Mobile / Score UX
- v0.6.0: WAV Export
- v0.7.0: Custom Tuning / Project Data
- v0.8.0: UX / Learning Support
- v0.9.0: Release Candidate
- v1.0.0: Formal Release
