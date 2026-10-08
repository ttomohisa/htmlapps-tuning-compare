# Changelog

## 1.0.1 — 2026-10-08

- Add an editable, persisted project JSON filename with Unicode-safe, extension-preserving export names.
- Validate project imports before replacement, bound file size, use clean defaults for legacy omissions, and ignore stale reads or confirmations.
- Keep asynchronous WAV export on one A/B score/settings snapshot, prevent duplicate renders after UI updates, and preflight duration/working-memory limits before audio allocation.
- Use EN / JA destination labels with localized accessible names and titles; retain the local-processing badge.
- Add permanent fixed-frequency, explicit-rest, PCM format, import race/cancel, and filename regression tests.


## 1.0.0

- Hid duplicated Note / Rest, duration, and accidental controls from the upper score toolbar on smartphones; the fixed bottom score bar is now the single mobile input control surface.
- Changed the fixed mobile duration labels to note/rest terminology based on the active mode (for example, Eighth note vs Eighth rest).
- Tapping an empty staff position while an event is selected now dismisses the selection first instead of immediately creating another event.
- Changed score timing so unused horizontal space no longer creates implicit silence; only explicit rest events add silent time in live playback and WAV export.
- Updated the playback cursor to follow symbol-driven timing and jump across unused visual space instead of traversing it as silence.
- Changed duration selection to configure the next score input only; it no longer changes the duration of an already selected event.
- Added ♭ / ♮ / ♯ to the fixed smartphone score-input bar and added one-tap 3rd-below / 3rd-above chord helpers for selected notes and chords.
- Prioritized accidental/note hit targets over blank staff positions and made same-position accidental input replace the existing note spelling instead of leaving the original natural note behind.
- Made the score length adjustable from 1 to 16 measures, with confirmation before shrinking away existing events and Undo / Redo support.
- Added a compact fixed Note / Rest + duration toolbar above the mobile bottom navigation so core input controls remain visible while editing the score.
- Collapsed the sample-score panel by default and added more spacing between the score canvas and playback controls.
- Added sixteenth notes and sixteenth rests with quarter-beat snapping.
- Added long-press duplication for chords, preserving voicing, accidentals, and duration.
- Locked horizontal chord dragging so all chord-note pitches remain unchanged.
- Added vertical-only note movement inside chords plus a selected-chord pitch lane for easier targeted note addition.
- Added horizontal dragging for rests.
- Added the GitHub Pages demo link to the English and Japanese README files.
- Promoted Tuning Compare from the v0.9.0 release candidate to the first formal release.
- Finalized the score editor, including treble-clef pitch geometry, standard rest placement, enlarged quarter/eighth rest glyphs, measure barlines, chord notation, drag editing, accidental editing, and Undo behavior.
- Finalized A/B tuning comparison for 12-tone equal temperament, 5-limit just intonation, and custom tunings.
- Finalized local WAV export, project JSON import/export, autosave, Japanese/English UI, and smartphone navigation.
- Removed stale release-candidate and pre-WAV help text from the user-facing UI.
- Updated release documentation, version metadata, favicon checks, and screenshots for v1.0.0.
- Kept runtime processing local with no external network dependency.

## 0.9.0

- Added duration-based overwrite for newly inserted notes: later events covered by the new note are removed in the same Undo operation.
- Kept rest insertion out of the duration-based overwrite behavior.
- Refined treble-clef size and placement to span the staff more like conventional engraving.
- Removed the system-start barline immediately after the clef/time signature and kept measure-end barlines only.
- Restored the eighth-rest music glyph and enlarged both quarter- and eighth-rest glyphs.
- Corrected whole-rest and half-rest placement to standard staff-line positions.
- Uses standard music-rest glyphs for both quarter and eighth rests at larger sizes.
- Extended staff lines behind the treble clef and time signature and layered the symbols above the staff.
- Removed the redundant score-header "4 measures / event count" badge.
- Added click-to-apply accidental editing for existing notes using the selected flat / natural / sharp tool, with Undo support.
- Added AppConfirm before clearing the whole score while keeping Toast + Undo after confirmation.
- Reserved playback-indicator space in idle state so Play A / Play B button dimensions do not change during playback.
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
