# Changelog

## 0.9.0

- Promoted the comparison target to a sibling workspace at the same hierarchy as A/B tuning comparison, with its table, listening guidance, and playback controls grouped inside it.
- Corrected treble-clef note placement so C4 uses the ledger line below the staff and E4/G4/B4/D5/F5 align to the five staff lines.
- Corrected pointer and drag pitch conversion plus ledger-line placement to use the same score origin.
- Moved the comparison-note controls into an independent comparison-target panel, separate from tuning A/B settings.
- Updated score playback controls to match the A/B comparison and visibly mark the active tuning.
- Replaced native confirmation prompts with the template confirmation dialog for sample replacement and project import.
- Adjusted mobile tab scroll positioning to align the selected card directly below the sticky header.
- Relaxed the Sound Settings layout with stacked controls, a separated advanced panel, and roomier playback state.
- Fixed runtime initialization failures caused by using the single-element ` helper for multi-element score listeners.
- Kept A/B reference note, reference frequency, and just-intonation tonic selectors available and correctly initialized.
- Simplified A/B playback to Play A, Play B, and Stop, with a visible active-side state.
- Expanded the score from two to four measures.
- Added duration-aware horizontal snapping so quarter/eighth input follows the selected rhythmic value.
- Reworked note hit targets so nearby staff positions remain available for input.
- Reworked chord notation to use a shared stem and adjacent-note head offsets.
- Added note drag editing: vertical pitch movement and horizontal event movement with Undo support.
- Prevented rests from silently overwriting notes and notes from silently overwriting rests.
- Updated four built-in samples and playback cursor behavior for the four-measure score.

## 0.8.0

- Added a dynamic “What to listen for” panel to the A/B comparison.
- Added largest cents-gap and Hz-gap metrics derived from the current A/B notes.
- Added descriptive higher/lower wording and preset-specific listening tips.
- Added four embedded sample scores: Major third, Major triad, C major scale, and I–IV–V–I.
- Added confirmation before replacing a non-empty score with a sample.
- Sample loading participates in Undo, autosave, project JSON, A/B playback, and WAV export through the existing score model.
- Updated stale introductory/help copy to reflect the current application capabilities.

## 0.7.0

- Added custom tuning editing as absolute Hz, ratios, or cents offsets.
- Added selectable C4–B4 ratio reference and custom tuning names.
- Kept absolute Hz as the internal custom-tuning representation so switching edit modes does not retune notes by itself.
- Added schemaVersion 1 project JSON export/import covering score, A/B tunings, custom tuning, sound, language, and WAV settings.
- Added project kind/schema validation, unsupported-schema handling, import confirmation, and immediate in-page restore without reload.
- Clear transient playback and Undo/Redo state when importing a project.

## 0.6.0

- Replaced the canonical favicon/app icon with the supplied final Tuning Compare SVG.
- Added local 16-bit mono PCM WAV export at 48 kHz or 44.1 kHz.
- Added A-only, B-only, and A → B comparison export targets.
- Added OfflineAudioContext rendering using the same score timing, tuning, timbre, volume, attack, and release settings as live playback.
- Added one shared A/B peak-safety scale instead of per-side normalization.
- Added editable/sanitized WAV filenames and local persistence for export settings.

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
