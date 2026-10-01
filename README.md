# Tuning Compare / 音律聞き比べ

A Browser Kitty app for comparing equal temperament, just intonation, and exact custom tunings, including playback from a short score.

**v0.4.0 is the Score Editor MVP milestone.** It adds a compact two-measure staff editor on top of the v0.3 A/B comparison.

## v0.4.0 features

- Independent A/B equal, 5-limit just, or custom tuning
- Major-third, perfect-fifth, and major-triad A/B comparison
- Two-measure treble-staff note entry by click or tap
- Chords by adding pitches at the same start position
- Rest input
- Whole / half / quarter / eighth durations
- Flat / natural / sharp
- 3/4 and 4/4
- 30–300 BPM
- Undo / Redo
- Score playback with tuning A or tuning B
- Playback cursor
- Sine / Soft harmonics / Rich harmonics
- Japanese / English UI and local persistence
- No runtime network dependency

## Privacy

Score data, frequencies, and tuning settings are processed in the browser. There is no runtime API, CDN, analytics, or telemetry dependency.

## Development

Edit `src/index.template.html`; do not hand-edit generated HTML.

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
pwsh -NoProfile -File .\scripts\check-repository.ps1
```

## Roadmap

- v0.5.0: Mobile / Score UX
- v0.6.0: WAV Export
- v0.7.0: Custom Tuning / Project Data
- v0.8.0: UX / Learning Support
- v0.9.0: Release Candidate
- v1.0.0: Formal Release

## License

MIT
