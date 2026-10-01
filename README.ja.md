# 音律聞き比べ / Tuning Compare

平均律・純正律・カスタム音律を聞き比べ、短い譜面を作り、その演奏をWAVとして保存できるBrowser Kitty向けブラウザアプリです。

**v0.6.0 は WAV Export の開発段階です。**

## v0.6.0でできること

- 譜面を **Aのみ** でWAV書き出し
- 譜面を **Bのみ** でWAV書き出し
- **A → B比較** を1つのWAVへ書き出し
- A → B間には0.6秒の無音を挿入
- PCM 16-bit / Mono
- 48 kHz / 44.1 kHz
- ファイル名を編集可能
- A/Bを同じ条件でオフラインレンダリング
- 必要な場合だけA/B共通の安全係数でピークを縮小
- リアルタイム録音ではなく `OfflineAudioContext` で生成
- 外部エンコーダー・外部API・WASM不要
- アップロードした最終SVGをfavicon / ヘッダーアイコンに使用

既存の機能も維持しています。

- A / Bそれぞれの12平均律、5-limit純正律、カスタム音律
- A/B聞き比べ
- 2小節の簡易譜面
- スマホの比較 / 譜面 / 音律 / 音の4ページ切替
- 休符、和音、♭ / ♮ / ♯
- 全音符 / 2分 / 4分 / 8分
- 3/4 / 4/4、30〜300 BPM
- Undo / Redo
- 日本語 / 英語
- 端末内自動保存

## プライバシー

譜面、周波数、音律設定、WAV生成はブラウザ内で処理します。音声や入力内容を外部へ送信しません。

## 開発

編集元は `src/index.template.html` です。生成済みHTMLは手動編集しません。

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
pwsh -NoProfile -File .\scripts\check-repository.ps1
```

## 開発予定

- v0.7.0: Custom Tuning / Project Data
- v0.8.0: UX / Learning Support
- v0.9.0: Release Candidate
- v1.0.0: Formal Release

## License

MIT
