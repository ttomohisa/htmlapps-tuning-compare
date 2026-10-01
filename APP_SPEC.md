# APP_SPEC.md — Tuning Compare / 音律聞き比べ

## 1. Product identity

- **Name:** Tuning Compare / 音律聞き比べ
- **Version:** 0.6.0
- **Current milestone:** WAV Export
- **Purpose:** Compare tunings, edit a short score, and export the resulting performance as a local WAV file without server processing.
- **Release artifacts:** `dist/index.html`, `dist/index.self-extract.html`, and repository-root `tuning-compare.html`.

## 2. Template / icon contract

The app continues to use the current `htmlapps-template` shell, mobile navigation pattern, build placeholders, CSP, and single-HTML pipeline.

`assets/favicon.svg` is the canonical icon source for both the browser favicon and the app icon shown in the header.

## 3. WAV export scope

v0.6.0 exports the current score as:

- tuning A only
- tuning B only
- A → B comparison in one file

The A → B comparison contains the complete A render, 0.6 seconds of silence, then the complete B render.

## 4. WAV format

Initial export format:

- PCM
- 16-bit signed integer
- mono
- selectable 48 kHz or 44.1 kHz
- default 48 kHz

No external encoder, codec service, WASM dependency, or network request is used.

## 5. Offline rendering

WAV export uses `OfflineAudioContext` (or the browser-prefixed equivalent when available).

The offline renderer follows the same score data and audio parameters used by live playback:

- note frequencies are resolved through tuning slot A or B
- timbre uses the same harmonic coefficient sets
- master volume is shared
- attack and release are shared
- event timing uses the score tempo
- rests produce no oscillator

The export does not record real-time playback.

## 6. A/B level fairness

A and B are rendered separately using identical audio settings.

Before encoding:

1. inspect the peak sample of A
2. inspect the peak sample of B
3. use the larger peak to determine one shared safety scale
4. apply that same scale to both A and B

No independent A-only/B-only loudness normalization is performed.

If neither side exceeds the safety peak, the shared scale is 1.0.

## 7. Filename

The user can edit the WAV filename before export.

Unsafe filesystem characters are replaced. If the filename has no `.wav` extension, the app adds it automatically.

Suggested names follow the current export target:

- `tuning-compare-a.wav`
- `tuning-compare-b.wav`
- `tuning-compare-ab.wav`

## 8. Download behavior

After local rendering and encoding:

- create an `audio/wav` Blob
- create a temporary Blob URL
- trigger a browser download
- revoke the Blob URL shortly afterward

User score/audio data is not uploaded.

## 9. UI / state behavior

The WAV panel is part of the Score page on mobile and the normal score section on desktop.

The export button is disabled when:

- the score contains no audible note
- offline audio rendering is unavailable

Status text covers:

- rendering A
- rendering B
- encoding WAV
- success
- failure
- unsupported browser
- empty score

Export target, sample rate, and filename persist locally with the other app settings.

## 10. Existing behavior retained

v0.6.0 preserves:

- Audio Core
- equal temperament
- fixed 5-limit just intonation
- exact custom Hz tuning
- synchronized A/B comparison
- simple score editing
- mobile four-page navigation
- wrapped mobile score
- Undo / Redo
- local persistence
- Japanese / English

## 11. Privacy and network

- no runtime fetch, XHR, WebSocket, CDN, analytics, telemetry, or remote font
- `connect-src 'none'`
- WAV rendering and encoding occur locally in the browser
- generated audio remains local until the browser saves the file

## 12. Acceptance criteria

- uploaded final SVG is used as `assets/favicon.svg`
- favicon and header app icon come from the same canonical SVG
- score with at least one note can export A-only WAV
- score with at least one note can export B-only WAV
- score with at least one note can export one A → B comparison WAV
- export is mono 16-bit PCM
- 48 kHz and 44.1 kHz are selectable
- A and B use one shared peak-safety scale
- output filename is sanitized and ends in `.wav`
- no real-time recording is used
- no external encoder/network dependency is added
- standalone build and repository validation pass

## 13. Remaining roadmap

- v0.7.0: Custom Tuning / Project Data
- v0.8.0: UX / Learning Support
- v0.9.0: Release Candidate
- v1.0.0: Formal Release
