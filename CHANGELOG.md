# Changelog

## 0.5.0

- Added template-style smartphone bottom page tabs for Compare, Score, Tuning, and Sound.
- Wrapped the two-measure score into one measure per system on smartphones instead of shrinking the desktop score.
- Added larger, vertically bounded score selection targets for touch input.
- Added a fixed selected-event editor above the mobile bottom navigation.
- Added Toast + Undo for reversible score deletion and clearing.
- Preserved desktop document flow and all existing v0.4 score/A-B functionality.

## 0.4.0

- Added a two-measure treble-staff score editor with click/tap step input.
- Added note, rest, chord, whole/half/quarter/eighth duration, accidental, 3/4 and 4/4, and 30–300 BPM controls.
- Added Undo/Redo history, event selection/deletion, and local score persistence.
- Added score playback using tuning A or B with AudioContext-timed scheduling and a playback cursor.
- Preserved the template-aligned UI and v0.3 A/B comparison workflow.

## 0.3.0

- Realigned the header, page intro, design tokens, dialogs, toast, spacing, cards, and responsive behavior with the current htmlapps-template UI.
- Added independent tuning slots A and B for equal temperament, 5-limit just intonation, and custom Hz maps.
- Added major-third, perfect-fifth, and major-triad quick comparison presets.
- Added synchronized dual-layer A/B playback with same-position crossfade switching and A → B automatic comparison.
- Added an A/B frequency and cent-difference table plus local persistence for both tuning slots.

## 0.2.0

- Added 12-tone equal-temperament calculation from an editable reference note/frequency.
- Added the defined 5-limit just-intonation ratio table with selectable tonic.
- Added C4–B4 custom per-note Hz editing with 2:1 octave derivation.
- Added C4–C5 frequency table, just-ratio display, equal-temperament cent offset, and per-note audition.
- Added copy-current-tuning-to-Custom workflow.
- Updated quick-note audition to follow the selected tuning.
- Migrated local settings to a stable key while retaining a v0.1.0 fallback.

## 0.1.0

- Added browser-native Audio Core based on Web Audio API.
- Added arbitrary-frequency single-note audition from 20 Hz to 20 kHz.
- Added four-frequency manual chord audition with a 16-voice engine limit.
- Added Sine, Soft harmonics, and Rich harmonics timbres.
- Added master volume and attack/release controls.
- Added bilingual Japanese/English UI, local settings persistence, accessible status feedback, and help.
- Kept runtime networking disabled and added no third-party dependencies.
