# 音律聞き比べ / Tuning Compare

同じ譜面を異なる音律で聞き比べるためのBrowser Kitty向けブラウザアプリです。

**v0.2.0 は Tuning Engine の開発段階です。** v0.1.0のAudio Coreに、12平均律、定義済み5-limit純正律、C4〜B4のカスタムHz編集を追加しています。

## v0.2.0でできること

- 編集可能な基準音から12平均律を計算・試聴
- 主音を選べる定義済み5-limit純正律を計算・試聴
- C4〜B4をHzで直接編集し、他オクターブは2:1で生成
- 周波数・主音比・平均律との差（cent）を確認
- 20〜20,000 Hzの任意周波数を試聴
- 最大4つの周波数を画面から同時試聴
- 内部エンジンは最大16ボイスに対応
- 正弦波 / やわらかい倍音 / 豊かな倍音
- 音量、Attack、Release調整
- 日本語 / 英語切替
- 設定の端末内保存
- 実行時の外部通信なし

## 開発予定

- v0.3.0: A/B Compare
- v0.4.0: Score Editor MVP
- v0.5.0: Mobile / Score UX
- v0.6.0: WAV Export
- v0.7.0: Custom Tuning / Project Data
- v0.8.0: UX / Learning Support
- v0.9.0: Release Candidate
- v1.0.0: Formal Release

## プライバシー

入力した周波数や設定はブラウザ内で処理します。v0.2.0には外部API、CDN、分析、テレメトリはありません。

## 開発

この実装は `ttomohisa/htmlapps-template` の 2026-09-29 時点の `main`（commit `cb908779682fa315ccd0f1eb58549f6c208f36f0`）を基準にした差し替えファイルです。

テンプレートへこのoverlayを適用し、Windowsで次を実行してください。

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-repository.ps1
```

生成物はテンプレートの契約どおり `dist/index.html`、`dist/index.self-extract.html`、ルートの `tuning-compare.html` です。

## License

MIT
