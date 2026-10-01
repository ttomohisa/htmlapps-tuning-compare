# Tuning Compare / 音律聞き比べ

A Browser Kitty app for comparing tunings with A/B playback, a short score editor, WAV export, and project JSON — all processed locally in the browser.

**v0.9.0 is the Release Candidate milestone.**

## v0.9.0 changes

### A/B tuning comparison

Playback is reduced to three controls:

- **Play A**
- **Play B**
- **Stop**

The currently playing side is visibly selected and also shown by the A/B status indicator.

Reference note, reference frequency, and just-intonation tonic remain selectable regardless of the current tuning type.

v0.9.0 also fixes listener registration that used the single-element `$` helper where the multi-element `$$` helper was required. That runtime error could stop initialization before A/B options and score playback were ready.

### Simple score

The score now has **four measures**.

Input positions snap to the selected duration. In 4/4, the primary starts per measure are:

- whole: 1
- half: 2
- quarter: 4
- eighth: 8

Also added or refined:

- drag notes vertically to change pitch
- drag horizontally to move event start
- shared chord stems
- smaller note-selection targets so nearby staff positions remain usable
- no silent note → rest overwrite
- no silent rest → note overwrite
- playback cursor across all four measures

## Main features

- 12-tone equal temperament
- 5-limit just intonation
- Custom tuning in Hz / Ratio / Cents
- A/B frequency and cents comparison
- listening guidance
- four-measure score editor
- sample scores
- score playback with tuning A or B
- WAV export
- project JSON
- Undo / Redo
- Japanese / English UI
- local autosave
- no runtime network dependency

## Privacy

Score data, tunings, comparison calculations, JSON, and WAV generation stay in the browser. User input and generated audio are not uploaded.

## Development

Edit `src/index.template.html`; do not hand-edit generated HTML.

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
pwsh -NoProfile -File .\scripts\check-repository.ps1
```

## Roadmap

- v1.0.0: Formal Release

## License

MIT
