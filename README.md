# Tuning Compare / 音律聞き比べ

A Browser Kitty app for comparing tunings by ear with measurable A/B differences, short sample scores, custom tuning tools, WAV export, and project files.

**v0.8.0 is the UX / Learning Support milestone.**

## v0.8.0 additions

### What to listen for

For the current A/B comparison, the app identifies:

- largest cents difference
- the note where it occurs
- whether B is higher or lower than A
- largest absolute Hz difference

This is descriptive rather than evaluative. It reports the current tuning settings instead of claiming one tuning is universally better.

Short listening prompts change for Major third, Perfect fifth, and Major triad.

### Sample scores

Four embedded examples are available:

- **Major third** — sustained C4 + E4
- **Major triad** — sustained C4 + E4 + G4
- **C major scale** — quarter notes from C4 through C5
- **I–IV–V–I** — C / F / G / C chord progression

If a score already contains events, the app confirms before replacing it.

Loading a sample is undoable.

## Existing features

- 12-tone equal temperament
- 5-limit just intonation
- Custom tuning in Hz / Ratio / Cents
- synchronized A/B comparison
- two-measure score editor
- four-page mobile UI
- Undo / Redo
- A-only / B-only / A→B WAV export
- project JSON
- Japanese / English UI
- local autosave

## Privacy

Score data, tunings, comparison calculations, project JSON, and WAV generation stay in the browser. User input and generated audio are not uploaded.

## Development

Edit `src/index.template.html`; do not hand-edit generated HTML.

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
pwsh -NoProfile -File .\scripts\check-repository.ps1
```

## Roadmap

- v0.9.0: Release Candidate
- v1.0.0: Formal Release

## License

MIT
