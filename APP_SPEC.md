# APP_SPEC.md — Tuning Compare / 音律聞き比べ

## 1. Product identity

- **Name:** Tuning Compare / 音律聞き比べ
- **Version:** 0.7.0
- **Current milestone:** Custom Tuning / Project Data
- **Purpose:** Compare tunings, edit a custom 12-note scale with multiple numeric representations, and save or restore the complete app state as a local JSON project.
- **Release artifacts:** `dist/index.html`, `dist/index.self-extract.html`, and repository-root `tuning-compare.html`.

## 2. Existing application contract

v0.7.0 preserves the current `htmlapps-template` shell, favicon/app icon pipeline, mobile bottom navigation, score editor, A/B comparison, local WAV export, CSP, and single-HTML build.

No third-party runtime dependency is introduced.

## 3. Custom tuning model

The custom tuning stores absolute C4–B4 frequencies internally in Hz.

Other octaves continue to derive from those values at a 2:1 octave ratio.

The editor exposes three representations without changing the underlying storage model:

- **Hz:** direct absolute frequency
- **Ratio:** frequency ratio relative to a selected C4–B4 reference note
- **Cents:** cents offset from 12-tone equal temperament calculated from the current reference note and reference frequency

Changing representation changes the editor, not the stored tuning concept.

## 4. Hz editing

Hz mode accepts direct values from 20 to 20,000 Hz.

Example:

- A4 = 442.000 Hz
- E4 = 329.200 Hz

The entered value becomes the stored custom frequency for that pitch class.

## 5. Ratio editing

Ratio mode has a selectable ratio reference note. Default is C4.

The reference note is displayed as 1/1 and is not edited in ratio mode. Its absolute frequency can be changed in Hz or cents mode.

Other notes accept:

- fraction notation such as `5/4`, `3/2`, `15/8`
- positive decimal notation such as `1.25` or `1.5`

The input is converted to an absolute frequency using the current custom frequency of the ratio reference note.

Displayed ratios use a best rational approximation with denominator up to 64.

## 6. Cents editing

Cents mode treats the current detailed-tuning reference note and reference frequency as the equal-temperament baseline.

For a note:

`customHz = equalHz × 2^(cents / 1200)`

Therefore a user can enter positive or negative cent offsets while the stored custom tuning remains absolute Hz.

Reference note / frequency stay editable in Custom mode because they define the cents baseline. Changing that reference does not silently rewrite existing custom frequencies.

## 7. Custom tuning metadata

Custom tuning state includes:

- name
- edit mode: `hz`, `ratio`, or `cents`
- ratio reference note
- C4–B4 absolute frequency map

This metadata is persisted locally and included in project JSON.

## 8. Project JSON format

Project exports use:

- `kind = "browser-kitty.tuning-compare-project"`
- `schemaVersion = 1`
- app version
- export timestamp
- complete project state

The nested project state also carries `schemaVersion = 1`.

## 9. Project JSON contents

A v1 project includes enough state to restore:

- language
- detailed tuning type and reference settings
- custom tuning metadata and custom frequency map
- tuning A configuration and custom A map
- tuning B configuration and custom B map
- comparison preset and root
- score events
- BPM and time signature
- single-note/chord audition settings
- timbre, volume, attack, and release
- WAV export target, sample rate, and filename

Transient runtime state is excluded:

- AudioContext
- active voices
- playback cursor
- Undo/Redo history
- open dialogs

## 10. Export

Project export creates a local `application/json` Blob and downloads it with a sanitized filename based on the custom tuning name.

No network request is involved.

## 11. Import

The importer accepts local JSON files only.

Before replacing current state it:

1. parses JSON
2. validates the project kind
3. validates `schemaVersion = 1`
4. asks for confirmation because import replaces the current project

After confirmation:

- audio playback is stopped
- transient score Undo/Redo state is cleared
- imported state is applied immediately
- the interface is re-rendered
- the imported state becomes the new local autosaved state

Import does not require a page reload.

## 12. Error handling

The UI distinguishes:

- malformed or unrelated JSON
- unsupported schema version
- local storage failure
- invalid ratio input

Invalid ratio/frequency input must not overwrite the last valid custom frequency.

## 13. Privacy and network

- no runtime fetch, XHR, WebSocket, CDN, analytics, telemetry, or remote font
- `connect-src 'none'`
- JSON export/import is local
- score, tuning, and audio data are not uploaded
- WAV remains locally generated

## 14. Acceptance criteria

- Custom mode offers Hz / Ratio / Cents editing
- ratio reference is selectable from C4–B4
- `5/4` and `1.25` are both accepted as ratios
- the ratio reference is displayed as 1/1
- cents are relative to the current equal-temperament reference pitch
- changing custom edit representation does not change the tuning by itself
- custom tuning name/edit mode/ratio base survive reload
- exported JSON contains project kind and schemaVersion
- imported v1 JSON restores score, A/B tunings, custom tuning, sound, and WAV settings
- invalid JSON does not replace current state
- unsupported schema does not replace current state
- import clears transient Undo/Redo state
- standalone build and repository validation pass

## 15. Remaining roadmap

- v0.8.0: UX / Learning Support
- v0.9.0: Release Candidate
- v1.0.0: Formal Release
