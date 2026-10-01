# Tuning Compare / 音律聞き比べ

A Browser Kitty app for comparing equal temperament, just intonation, and exact custom tunings with the same timbre and playback position.

**v0.3.0 is the A/B Compare milestone.** Tuning A and B are configured independently. Both audio layers start on the same AudioContext timeline, so switching A/B changes tuning without restarting the comparison.

## v0.3.0 features

- Independent A/B equal, 5-limit just, or custom tuning
- Independent reference pitch and just-intonation tonic per side
- Separate direct C4–B4 custom Hz maps for A and B
- Major-third, perfect-fifth, and major-triad quick comparisons
- Synchronized dual-layer playback with an approximately 24 ms A/B crossfade
- Automatic A → B comparison
- Exact A/B frequency and cent-difference table
- v0.2 C4–C5 tuning inspection and per-note audition
- Arbitrary-Hz single-note and chord audition
- Sine / Soft harmonics / Rich harmonics
- Japanese / English UI and local settings persistence
- No runtime network dependency

## Privacy

Frequencies, tuning settings, and interactions are processed in the browser. There is no runtime API, CDN, analytics, or telemetry dependency.

## Development

The repository follows the current `ttomohisa/htmlapps-template` structure. Edit `src/index.template.html`; do not hand-edit generated HTML.

Windows verification:

    powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
    pwsh -NoProfile -File .\scripts\check-repository.ps1

## Roadmap

- v0.4.0: Score Editor MVP
- v0.5.0: Mobile / Score UX
- v0.6.0: WAV Export
- v0.7.0: Custom Tuning / Project Data
- v0.8.0: UX / Learning Support
- v0.9.0: Release Candidate
- v1.0.0: Formal Release

## License

MIT
