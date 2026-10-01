# Tuning Compare / 音律聞き比べ

A Browser Kitty browser app for hearing the same music with different tuning systems.

**v0.2.0 is the Tuning Engine milestone.** It adds equal temperament, a concrete 5-limit just-intonation preset, and direct C4–B4 custom Hz editing on top of the v0.1.0 Audio Core.

## v0.2.0 features

- Calculate and audition 12-tone equal temperament from an editable reference pitch
- Calculate and audition a fixed-ratio 5-limit just-intonation preset with selectable tonic
- Edit C4–B4 as exact custom Hz values and derive other octaves at 2:1
- Inspect frequency, just ratio, and cent difference from equal temperament
- Audition arbitrary frequencies from 20 to 20,000 Hz
- Play up to four visible manual chord frequencies
- Audio engine supports up to 16 concurrent voices
- Sine / Soft harmonics / Rich harmonics
- Master volume, attack, and release controls
- Japanese / English UI
- Local settings persistence
- No runtime network dependency

## Roadmap

- v0.3.0: A/B Compare
- v0.4.0: Score Editor MVP
- v0.5.0: Mobile / Score UX
- v0.6.0: WAV Export
- v0.7.0: Custom Tuning / Project Data
- v0.8.0: UX / Learning Support
- v0.9.0: Release Candidate
- v1.0.0: Formal Release

## Privacy

Frequencies and settings are processed in the browser. v0.2.0 has no runtime API, CDN, analytics, or telemetry dependency.

## Development

This implementation overlay targets `ttomohisa/htmlapps-template` `main` at commit `cb908779682fa315ccd0f1eb58549f6c208f36f0` (2026-09-29).

Apply these files over that template, then run on Windows:

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

The template build contract generates `dist/index.html`, `dist/index.self-extract.html`, and repository-root `tuning-compare.html`.

## License

MIT
