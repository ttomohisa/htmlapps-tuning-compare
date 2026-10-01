# Tuning Compare / 音律聞き比べ

A Browser Kitty app for comparing tunings, editing a short score, exporting WAV audio, and saving the complete work as project JSON.

**v0.7.0 is the Custom Tuning / Project Data milestone.**

## v0.7.0 features

### Custom tuning

Custom tuning internally stores absolute C4–B4 frequencies in Hz.

The editor can switch among:

- **Hz** — direct absolute frequency
- **Ratio** — values such as 5/4, 3/2, or 1.25 relative to a selected 1/1 reference note
- **Cents** — offset from equal temperament calculated from the current reference pitch

The ratio reference note is selectable from C4 through B4.

Custom tunings can also be named.

### Project JSON

Export and restore the entire working state as JSON, including:

- score
- BPM / time signature
- A / B tuning configuration
- A / B custom frequency maps
- detailed custom tuning
- timbre, volume, attack, and release
- WAV export settings
- UI language

Project files use `schemaVersion: 1`.

Import asks before replacing the current project, stops playback, clears transient Undo/Redo history, and applies the imported project immediately without reloading the page.

## Existing features

- 12-tone equal temperament
- 5-limit just intonation
- synchronized A/B comparison
- two-measure simple score editor
- four-page mobile UI
- Undo / Redo
- A-only / B-only / A→B WAV export
- mono 16-bit PCM at 48 kHz or 44.1 kHz
- Japanese / English UI
- local autosave

## Privacy

Score data, tunings, JSON, and WAV generation stay in the browser. User input and generated audio are not uploaded.

## Development

Edit `src/index.template.html`; do not hand-edit generated HTML.

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
pwsh -NoProfile -File .\scripts\check-repository.ps1
```

## Roadmap

- v0.8.0: UX / Learning Support
- v0.9.0: Release Candidate
- v1.0.0: Formal Release

## License

MIT
