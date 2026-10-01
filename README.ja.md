# 音律聞き比べ / Tuning Compare

平均律・純正律・カスタム音律を聞き比べ、短い譜面を作り、WAVやプロジェクトJSONとして保存できるBrowser Kitty向けブラウザアプリです。

**v0.7.0 は Custom Tuning / Project Data の開発段階です。**

## v0.7.0でできること

### カスタム音律

カスタム音律は内部ではC4〜B4の絶対周波数をHzで保持します。

編集方法は切り替えられます。

- **Hz** — 329.200 Hzのように絶対周波数を直接入力
- **比率** — 選択した基準音を1/1として、5/4・3/2・1.25などで入力
- **cent差** — 現在の基準ピッチから計算した12平均律との差を入力

比率の基準音はC4〜B4から選べます。

カスタム音律には名前も付けられます。

### プロジェクトJSON

現在の作業全体をJSONとして保存・復元できます。

保存対象には次が含まれます。

- 譜面
- BPM / 拍子
- A / Bの音律
- A / Bのカスタム周波数
- 詳細カスタム音律
- 音色・音量・Attack / Release
- WAV出力設定
- 表示言語

JSONには `schemaVersion: 1` を持たせています。

読み込み時は現在の状態を置き換える確認を表示し、読み込み後はページ再読み込みなしで反映します。

## 既存機能

- 12平均律
- 5-limit純正律
- A/B聞き比べ
- 2小節の簡易譜面
- スマホ4ページUI
- Undo / Redo
- Aのみ / Bのみ / A→B WAV
- PCM 16-bit Mono、48 kHz / 44.1 kHz
- 日本語 / 英語
- 端末内自動保存

## プライバシー

譜面、音律、JSON、WAVはブラウザ内で処理します。入力内容や生成音声を外部へ送信しません。

## 開発

編集元は `src/index.template.html` です。生成済みHTMLは手動編集しません。

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
pwsh -NoProfile -File .\scripts\check-repository.ps1
```

## 開発予定

- v0.8.0: UX / Learning Support
- v0.9.0: Release Candidate
- v1.0.0: Formal Release

## License

MIT
