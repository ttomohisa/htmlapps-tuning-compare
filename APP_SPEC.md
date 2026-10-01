# APP_SPEC.md — Tuning Compare / 音律聞き比べ

## 1. Product identity

- **Name:** Tuning Compare / 音律聞き比べ
- **Version:** 0.3.0
- **Current milestone:** A/B Compare
- **Purpose:** Let users configure two tunings independently and hear the same notes with only the tuning changed.
- **Primary users:** Musicians, music learners, and people exploring tuning and pitch relationships.
- **Release artifacts:** `dist/index.html`, `dist/index.self-extract.html`, and repository-root `tuning-compare.html`.

## 2. v0.3.0 outcome

v0.3.0 keeps the v0.1 Audio Core and v0.2 Tuning Engine, aligns the application shell with the current htmlapps-template design, and adds synchronized A/B tuning comparison.

## 3. Template UI contract

- Reuse the current template header structure, design tokens, sticky header behavior, language button, SVG help button, page-intro pattern, local-processing badge, dialog styling, and toast styling.
- App-specific UI extends those tokens instead of redefining an unrelated design system.
- The header meta line remains app-specific rather than exposing generic template copy.
- Desktop and smartphone layouts are first-class.

## 4. A/B tuning slots

Two independent slots named A and B are available. Each slot supports:

- 12-tone equal temperament
- the defined 5-limit just-intonation preset
- custom C4–B4 frequencies in Hz
- independent reference note and reference frequency for equal/just modes
- independent tonic for just intonation
- independent custom-frequency map

Default: A = 12-tone equal temperament, B = 5-limit just intonation, both referenced to A4 = 440 Hz with C as the just-intonation tonic.

## 5. Quick comparison material

v0.3.0 provides three short comparison presets:

- Major third
- Perfect fifth
- Major triad

The root note is selectable from C4 through B4. The frequency table shows the exact A frequency, B frequency, and B-minus-A cent difference for every note in the selected comparison.

## 6. Synchronized A/B playback

- A and B oscillator layers start on the same AudioContext timeline.
- Only the active layer is audible.
- Switching A/B crossfades the two group gains over roughly 24 ms to avoid clicks.
- The switch does not restart oscillators, so comparison remains at the same playback position.
- Play A and Play B start a synchronized session on the requested side.
- A → B starts on A and changes to B after about 1.8 seconds.
- Stop releases all comparison voices.
- The same timbre, master volume, attack, and release settings apply to both sides.

## 7. Tuning engine retained from v0.2.0

- Equal temperament uses `f * 2^((m-r)/12)`.
- 5-limit ratios are `1/1, 16/15, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5, 5/3, 9/5, 15/8` from the selected tonic.
- Custom C4–B4 values are direct Hz values and other octaves derive at 2:1.
- The detailed C4–C5 inspection table and manual arbitrary-frequency audition remain available.

## 8. State and persistence

Persist locally when available: language, detailed tuning settings, manual audition settings, A/B preset/root, both slot configurations, and both custom-frequency maps. Audio runtime objects are never persisted.

## 9. Privacy and network

- No runtime fetch, XHR, WebSocket, CDN, analytics, telemetry, or remote font.
- `connect-src 'none'` remains required.
- Frequency calculation and audio generation occur entirely in the browser.

## 10. Accessibility and mobile

- Minimum page width 320 px.
- A/B cards become one column on narrow screens.
- Frequency tables scroll inside their own containers without causing page-level horizontal scrolling.
- Every custom frequency input has a note/slot-specific accessible name.
- A/B state is identified by text, not color alone.
- Help remains fully scrollable on short smartphone viewports.

## 11. Acceptance criteria

- The header and top-level visual system use the current htmlapps-template structure/tokens.
- Default A is equal temperament and default B is C-based 5-limit just intonation at A4 = 440 Hz.
- Major-triad comparison produces three frequencies per side.
- A/B switch changes the audible layer without restarting the synchronized oscillators.
- A and B can each use Custom with separate C4–B4 values.
- The comparison table reports cent difference from A to B.
- v0.1/v0.2 manual audition and detailed tuning inspection continue to work.
- No third-party runtime dependency is added.
- Template placeholders, canonical icon, CSP, and standalone build markers remain valid.

## 12. Remaining roadmap

- v0.4.0: Score Editor MVP
- v0.5.0: Mobile / Score UX
- v0.6.0: WAV Export
- v0.7.0: Custom Tuning / Project Data
- v0.8.0: UX / Learning Support
- v0.9.0: Release Candidate
- v1.0.0: Formal Release
