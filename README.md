# Tuning Compare / 音律聞き比べ

A Browser Kitty app for comparing tunings, editing a short score, and saving the result as a WAV file.

**v0.6.0 is the WAV Export milestone.**

## v0.6.0 features

- Export the score with tuning A only
- Export the score with tuning B only
- Export one A → B comparison WAV
- 0.6 seconds of silence between A and B
- PCM 16-bit / Mono
- 48 kHz / 44.1 kHz
- Editable filename
- Offline A/B rendering under identical audio settings
- One shared peak-safety scale when needed
- `OfflineAudioContext` instead of real-time recording
- No external encoder, API, or WASM dependency
- Final supplied SVG used for both favicon and header app icon

Existing features remain available:

- Independent A/B equal, 5-limit just, or custom tuning
- Synchronized A/B comparison
- Two-measure simple score editor
- Four-page mobile navigation
- Rests, chords, flat / natural / sharp
- Whole / half / quarter / eighth durations
- 3/4 and 4/4, 30–300 BPM
- Undo / Redo
- Japanese / English UI
- Local persistence

## Privacy

Score data, frequencies, tuning settings, and WAV generation stay in the browser. Audio and user input are not uploaded.

## Development

Edit `src/index.template.html`; do not hand-edit generated HTML.

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
pwsh -NoProfile -File .\scripts\check-repository.ps1
```

## Roadmap

- v0.7.0: Custom Tuning / Project Data
- v0.8.0: UX / Learning Support
- v0.9.0: Release Candidate
- v1.0.0: Formal Release

## License

MIT
