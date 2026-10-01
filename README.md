# Tuning Compare / 音律聞き比べ

A Browser Kitty app for comparing equal temperament, just intonation, and custom tunings with a short score editor.

**v0.5.0 is the Mobile / Score UX milestone.** On smartphones, the long tool becomes four bottom-tab pages: Compare, Score, Tuning, and Sound.

## v0.5.0 features

- Four-page smartphone bottom navigation
- Safe-area-aware fixed bottom bar
- Normal full document flow remains on desktop
- Two-measure score wraps to one measure per system on phones
- No horizontal panning required for score input
- Fixed selected-event editor above the mobile navigation
- Change duration or delete the selected event from the fixed editor
- Toast + Undo after event deletion or score clear
- Independent A/B equal, 5-limit just, or custom tuning
- Synchronized A/B comparison
- Two-measure simple score editor
- Rests, chords, flat / natural / sharp
- Whole / half / quarter / eighth durations
- 3/4 and 4/4, 30–300 BPM
- Score playback with tuning A or B
- Japanese / English UI
- Local persistence
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

- v0.6.0: WAV Export
- v0.7.0: Custom Tuning / Project Data
- v0.8.0: UX / Learning Support
- v0.9.0: Release Candidate
- v1.0.0: Formal Release

## License

MIT
