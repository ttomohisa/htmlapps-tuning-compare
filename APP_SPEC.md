# APP_SPEC.md — Tuning Compare / 音律聞き比べ

## 1. Product identity

- **Name:** Tuning Compare / 音律聞き比べ
- **Version:** 1.0.0
- **Current milestone:** Formal Release
- **Purpose:** Compare tuning A and B by ear and by frequency/cents, edit a short score, export WAV audio, and save the full project locally.
- **Release artifacts:** `dist/index.html`, `dist/index.self-extract.html`, and repository-root `tuning-compare.html`.

## 2. Template contract

The app continues to follow the current `htmlapps-template` shell:

- template header and version badge
- APP / HELP markers
- canonical favicon/app-icon pipeline
- dialogs and Toast pattern
- mobile bottom navigation
- local-only CSP and single-HTML build

No third-party runtime dependency is added.

## 3. v1.0.0 release baseline

v1.0.0 retains the release-candidate interaction fixes and defines them as the formal release baseline.

### Runtime initialization

All multi-element listeners must use the app's `$$` helper rather than calling array methods on the single-element `$` helper.

Initialization must reach:

- tuning-control option population
- A/B reference note / tonic option population
- saved-state restore
- score playback event binding
- final render

A JavaScript listener-registration error must not stop the remainder of app initialization.

## 4. A/B tuning controls

Each A/B slot keeps independently editable:

- tuning type
- reference note
- reference frequency
- just-intonation tonic
- custom frequencies

Reference note, reference frequency, and tonic remain selectable even when the current tuning type does not use all of them. This lets users prepare the next tuning setting before switching type.

## 5. A/B playback

The Compare page has only:

- **Play A**
- **Play B**
- **Stop**

The previous Switch A/B and automatic A → B controls are removed.

While A is playing:

- Play A has the active visual state
- the existing “playing” indicator displays A

While B is playing the same applies to B.

Stop and natural playback completion clear the active state.

## 6. Score length

The score is fixed at **four measures** in v1.0.0.

- 4/4 → 16 total beats
- 3/4 → 12 total beats

Desktop displays two measures per system.

Smartphone displays one measure per system.

No page-level horizontal scrolling is required.

## 7. Duration-aware horizontal input

Horizontal note/rest positions are snapped using the selected duration.

In 4/4:

- whole note → 1 valid start per measure
- half note → 2 primary starts
- quarter note → 4 starts
- eighth note → 8 starts
- sixteenth note → 16 starts

The same rule is applied when dragging an event horizontally.

An entered duration is constrained to start inside its current measure rather than silently creating the previous “eight quarter-note positions” behavior.

## 8. Nearby pitch input

Existing score events must not reserve a tall transparent selection rectangle spanning the chord.

Selection/drag targets are attached to:

- the visible note head
- a narrow target centered on the note head
- a compact target around a rest

This keeps adjacent staff positions available for adding nearby pitches.

When a chord is selected, a narrow vertical pitch lane is shown around its start position. Tapping/clicking the lane at a staff height adds that pitch to the selected chord while existing note heads remain directly draggable.

## 9. Chord notation

A chord is one score event with multiple notes.

Chord rendering uses:

- one note head per pitch
- horizontal note-head offset for adjacent seconds
- one shared stem per chord
- one shared eighth-note flag when needed
- one selection outline around the chord

The previous “one stem per note” appearance is removed.

## 10. Drag editing

A visible note can be dragged.

- for a single note, drag can change pitch and start position
- for a chord, drag direction locks after the movement threshold
- horizontal chord drag moves the whole event while preserving every note's pitch
- vertical chord-note drag changes only the grabbed note's pitch
- a selected chord can also be dragged horizontally from its selection outline
- horizontal movement uses duration-aware snapping
- movement into an occupied start position does not merge or overwrite the other event
- accidental type is preserved when the dragged note changes staff position
- the move is one Undo operation

Long-pressing a chord for about half a second duplicates the full chord, including duration, accidentals, and voicing, to the next available snapped position after it. Duplication is one Undo operation.

## 11. Rest behavior

Rest input must not silently overwrite notes.

- note already at target → keep the note, select it, and show a message
- rest already at target → allow duration update
- empty target → create rest

Likewise, note input must not silently replace a rest. The rest must be deleted first.

A rest can be dragged horizontally. Rest dragging changes only its start position, uses the rest's duration-aware snapping, keeps its duration, and is Undoable.

## 12. Score playback

Score playback remains available for tuning A and tuning B.

The runtime-initialization fix must ensure the playback buttons are actually bound.

Before playback:

- at least one audible score event must exist
- resolved frequencies must be valid

Playback uses the Web Audio timeline and the current timbre / volume / attack / release settings.

The playback cursor follows all four measures and moves between systems correctly.

## 13. Sample scores

The built-in samples now use the four-measure score:

- Major third: sustained C4 + E4 across four measures
- Major triad: sustained C4 + E4 + G4 across four measures
- C major scale: ascending two measures and descending two measures
- I–IV–V–I: one whole-measure chord per measure

Sample replacement still confirms before replacing a non-empty score and remains Undoable.

## 14. Existing features retained

- 12-tone equal temperament
- 5-limit just intonation
- custom tuning in Hz / ratio / cents
- A/B numeric comparison and listening guidance
- Japanese / English
- local autosave
- project JSON export/import
- WAV export
- four-page smartphone navigation
- Undo / Redo
- no runtime network dependency

## 15. RC UX polish

Additional v0.9.0 hands-on fixes:

- score playback uses the same Play A / Play B / Stop labels and active-button state as the A/B comparison
- sample-score replacement and project import use the template `AppConfirm` dialog; native `window.confirm` is not used
- mobile bottom navigation scrolls the active page to just below the actual sticky-header height, with a small gap, so content from the previous page does not peek above the selected card
- the Sound Settings card uses a stacked, roomier form layout with a separated Advanced Settings panel and playback-state block
- on smartphone widths, the template confirmation dialog presents as the template bottom-sheet variant

### Treble-clef pitch geometry

The score uses standard treble-clef vertical placement:

- bottom staff line: E4
- second line: G4
- middle line: B4
- fourth line: D5
- top line: F5
- C4: first ledger line below the staff

With 12 px between staff lines, adjacent natural-note staff positions are 6 px apart.

Rendering, pointer-to-pitch conversion, dragging, and ledger-line drawing must use the same origin. C4 is `systemTop + 60`.

### Independent comparison target

The notes being compared are visually separated from tuning A and tuning B.

The comparison-target workspace is a sibling of the A/B tuning comparison workspace and contains:

- note combination: Major third / Perfect fifth / Major triad
- root note

These controls remain one shared comparison target for both A and B. The entire comparison-target workspace is structurally and visually independent from the A/B tuning comparison workspace.

### Score clear confirmation

Clearing the whole score requires the template `AppConfirm` dialog.

- empty score: no confirmation is shown
- non-empty score: show title, explanation, Cancel, and destructive Clear action
- after confirmation, the clear operation is still added to Undo history
- the existing Toast + Undo remains available after clearing
- native `window.confirm` is not used

### Stable playback-button geometry

Play A / Play B buttons reserve the playing-indicator dot area in both idle and active states.

The indicator changes opacity rather than being inserted only during playback, so button width and neighboring controls must not shift when playback starts or stops.

### Rest engraving and accidental click editing

Score notation follows these additional rules:

- whole rest hangs from the fourth staff line (second line from the top)
- half rest sits on the middle staff line
- quarter and eighth rests use standard music-rest glyphs, displayed larger than the previous v0.9.0 sizing
- staff lines extend behind the treble clef and time signature so both symbols are visually part of the staff
- staff lines are drawn before clef/time-signature glyphs so the symbols remain legible
- no system-start barline is drawn immediately to the right of the clef/time signature; only measure-end barlines are drawn
- the score header does not show the redundant "4 measures / event count" badge
- clicking an existing note without dragging applies the currently selected accidental to that staff position
- flat / natural / sharp click edits participate in Undo history
- dragging still changes pitch/time and does not also apply the currently selected accidental on pointer release

### Covered-note overwrite

When a new note event is inserted, later score events whose start positions fall strictly inside the new note's duration are removed before the new note is added.

Example in 4/4:

- insert a whole note at beat 0
- existing events starting at beats 1, 2, and 3 are removed
- an event starting at beat 4 is outside the duration and remains

The overwrite is part of the same Undo snapshot as the newly inserted note, so one Undo restores the previous score.

This automatic overwrite applies to note insertion only. Rest insertion keeps the existing no-silent-overwrite behavior.

## 16. Acceptance criteria

- A/B reference-note and tonic dropdowns are populated and selectable
- only Play A / Play B / Stop remain in A/B playback
- playing side is visually identifiable
- initialization reaches the final app render without listener-registration exceptions
- quarter-note input in 4/4 exposes four starts per measure
- eighth-note input in 4/4 exposes eight starts per measure
- adjacent staff positions remain clickable next to existing notes
- C4 / E4 / G4 / B4 / D5 / F5 render at standard treble-clef positions
- pointer input and dragging use the same treble-clef pitch origin as rendering
- comparison target is visually independent from tuning A/B setting cards
- A/B tuning comparison and comparison target are sibling sections at the same workspace hierarchy
- chords use a shared stem
- score playback works for A and B
- score has four measures
- note dragging changes pitch/time and is Undoable
- rest input does not silently overwrite notes
- sixteenth-note and sixteenth-rest input use quarter-beat snapping in 4/4
- horizontal chord drag preserves all chord pitches
- vertical chord-note drag does not move the chord start
- long-pressing a chord duplicates it to the next available snapped position
- selected chords expose a pitch lane for easier targeted note addition
- rests can be dragged horizontally without changing duration
- score layout works on desktop and smartphone
- clearing a non-empty score uses the AppConfirm dialog before deletion
- clearing remains Undoable after confirmation
- A/B and score playback buttons do not change width when the playing indicator appears
- whole and half rests render at standard staff positions
- quarter and eighth rests use enlarged standard music-rest glyphs
- treble clef and time signature appear on the staff rather than outside the staff lines
- treble clef is enlarged/repositioned to span the staff in a conventional engraving-like placement
- no redundant vertical barline appears immediately after the clef/time signature
- redundant score-header measure/event-count badge is absent
- clicking an existing note applies the selected flat/natural/sharp without dragging
- quarter and eighth rest glyphs are visibly larger than the previous sizing
- inserting a long note removes later events covered by its duration, while the event at the exact end boundary remains
- one Undo restores both the inserted long note and the events it replaced
- rest insertion does not use the covered-note overwrite behavior
- standalone build and repository validation pass
- app version is consistently 1.0.0 in config and generated UI
- Japanese and English UI complete the core compare → score → WAV / JSON flow
- release screenshots include current Japanese desktop/mobile and English desktop UI
- favicon and header app icon use the same canonical SVG
- runtime CSP keeps external connections blocked

## 17. Post-v1.0 roadmap

Future additions are optional and must not weaken the v1.0.0 local-first comparison workflow.
