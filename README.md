# Tuning Compare / 音律聞き比べ

A Browser Kitty app for comparing 12-tone equal temperament, 5-limit just intonation, and custom tunings by ear and by frequency. It includes a four-measure score editor, local WAV export, and project JSON. Processing stays in the browser.

[日本語 README](README.ja.md)

![Tuning Compare screenshot](assets/screenshot-en.png)

## Features

- Compare tuning A and tuning B with the same notes, timbre, and level
- 12-tone equal temperament
- 5-limit just intonation with selectable tonic
- Custom tuning editing in Hz, ratio, or cents
- Frequency and cents difference display
- Four-measure treble-clef score editor
- Single notes, chords, rests, whole/half/quarter/eighth durations
- Sharp, flat, and natural accidentals
- 4/4 and 3/4 time signatures
- Sample scores for quick comparison
- Score playback with tuning A or B
- Local 16-bit mono WAV export at 44.1 kHz or 48 kHz
- A-only, B-only, and A → B comparison WAV export
- Project JSON export/import
- Undo / Redo and local autosave
- Japanese / English UI
- No runtime network dependency

## Usage

1. Configure tuning A and tuning B.
2. Choose notes to compare and play A or B.
3. Edit the short score if you want to compare a melody or chord progression.
4. Inspect frequencies, ratios, and cents differences.
5. Adjust a custom tuning when needed and listen again.
6. Export the score as WAV or save the project as JSON.

The score editor is intentionally small. Tuning Compare is not intended to replace notation software, a DAW, or a MIDI sequencer.

## Privacy

Score data, tuning settings, project JSON, and generated audio are processed locally in the browser. The app does not upload user input or generated audio, and the standalone build blocks runtime network connections.

## Browser support

Primary targets:

- Chrome
- Edge

The app also aims to work in current Safari and Firefox where the required Web Audio APIs are available.

Audio starts only after a user action because browsers restrict automatic audio playback.

## Development

The editable source is `src/index.template.html`. Generated standalone HTML should not be hand-edited.

Run repository validation on Windows PowerShell / PowerShell 7:

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
pwsh -NoProfile -File .\scripts\check-repository.ps1
```

## Build

```powershell
pwsh -NoProfile -File .\build-standalone.ps1
```

The build produces the standalone HTML configured in `app.config.json` and a repository-root `tuning-compare.html` copy. The repository validation also checks CSP, embedded favicon/app icon consistency, unresolved placeholders, and runtime network blocking.

## License

MIT
