# APP_SPEC.md — Tuning Compare / 音律聞き比べ

## 1. Product identity

- **Name:** Tuning Compare / 音律聞き比べ
- **Version:** 0.8.0
- **Current milestone:** UX / Learning Support
- **Purpose:** Help users understand where two tunings differ and provide short score examples that make those differences easier to explore by ear.
- **Release artifacts:** `dist/index.html`, `dist/index.self-extract.html`, and repository-root `tuning-compare.html`.

## 2. Existing application contract

v0.8.0 preserves:

- current `htmlapps-template` shell and responsive patterns
- A/B tuning comparison
- equal temperament / 5-limit just intonation / custom tuning
- two-measure score editor
- mobile four-page navigation
- WAV export
- project JSON
- local autosave
- favicon/app icon pipeline
- `connect-src 'none'`
- single-HTML build

No third-party runtime dependency is added.

## 3. Learning support goal

The learning UI must explain the current A/B configuration, not replace it with generic theory.

The app does not state that one tuning is universally better. It shows measurable differences and gives listening prompts.

## 4. A/B listening insight

The Compare page includes a “What to listen for” panel.

For the currently selected comparison notes, calculate:

- frequency for tuning A
- frequency for tuning B
- cents difference, B relative to A
- absolute Hz difference

From those rows display:

- the note with the largest absolute cents difference
- the signed cents difference for that note
- the note with the largest absolute Hz difference
- the absolute Hz difference

When the largest absolute cents difference is below 0.05 cents, explain that A and B are nearly identical for the current comparison notes.

## 5. Direction wording

For the note with the largest cents difference:

- positive cents: B is higher than A
- negative cents: B is lower than A

The wording is descriptive only and must not describe one tuning as better.

## 6. Contextual listening tips

Use one short tip based on the current A/B preset:

- **Major third:** listen to how the upper note moves when switching A/B
- **Perfect fifth:** keep the root as reference and listen to the upper note position
- **Major triad:** listen to both individual pitch movement and the chord as a whole

Tips update whenever the preset, root, or A/B tuning settings change.

## 7. Sample scores

The Score page provides four built-in examples:

### Major third

- C4 + E4
- whole-note chord in each measure
- 4/4
- 64 BPM

### Major triad

- C4 + E4 + G4
- whole-note chord in each measure
- 4/4
- 64 BPM

### C major scale

- C4 D4 E4 F4 | G4 A4 B4 C5
- quarter notes
- 4/4
- 92 BPM

### I–IV–V–I

- C major: C4 E4 G4
- F major: C4 F4 A4
- G major: G4 B4 D5
- C major: C4 E4 G4
- half-note chords
- 4/4
- 72 BPM

Sample scores do not change tuning A or tuning B.

## 8. Sample replacement safety

Sample scores must never silently overwrite an existing score.

If the score contains events:

1. ask for confirmation
2. only replace the score after confirmation

Loading a sample:

- pushes the previous score into Undo history
- resets score selection
- applies sample BPM / time signature
- can be reversed through Toast + Undo

If the score is empty, the sample can load directly.

## 9. Mobile behavior

The learning panel remains on the Compare mobile page.

Sample score controls remain on the Score mobile page.

At phone widths:

- learning metrics may stack or use a compact two-column layout
- sample buttons remain at least the existing mobile touch-target height
- neither feature may introduce page-level horizontal scrolling
- fixed score selection UI and bottom navigation must remain unobstructed

## 10. Language and accessibility

All new learning and sample-score text is available in Japanese and English.

The metrics use text plus numbers rather than color alone.

Sample controls use normal buttons with visible labels.

Dynamic listening insight updates are part of the existing rendered comparison UI and remain readable without relying on hover.

## 11. Existing project / WAV behavior

Sample score data becomes normal score data after loading.

Therefore it automatically participates in:

- local autosave
- project JSON export/import
- A/B score playback
- WAV export
- Undo / Redo

No separate sample-specific file format is introduced.

## 12. Privacy and network

- all calculations remain in the browser
- sample scores are embedded static data
- no external content is fetched
- no analytics/telemetry is introduced
- `connect-src 'none'` remains required

## 13. Acceptance criteria

- Compare page displays largest cents and Hz differences
- listening summary updates when A/B settings change
- direction text correctly distinguishes B higher/lower than A
- near-identical comparison displays an appropriate message
- contextual tips change for major third / fifth / triad
- four sample score buttons are available
- sample load does not alter A/B tunings
- non-empty score requires confirmation before sample replacement
- loaded sample can be undone
- loaded sample can be played as A and B
- loaded sample can be exported as WAV
- loaded sample survives autosave and project JSON export
- Japanese and English text both render
- standalone build and repository validation pass

## 14. Remaining roadmap

- v0.9.0: Release Candidate
- v1.0.0: Formal Release
