# 音律聞き比べ / Tuning Compare

平均律・純正律・カスタム音律を聞き比べ、短い譜面でも違いを確認できるBrowser Kitty向けブラウザアプリです。

**v0.4.0 は Score Editor MVP です。** v0.3.0のA/B比較に、2小節の簡易五線譜を追加しました。

## v0.4.0でできること

- A / Bそれぞれに12平均律、5-limit純正律、カスタム音律を設定
- 長三度・完全五度・長三和音のA/B比較
- 2小節の簡易五線譜へクリック / タップで音符入力
- 同じ開始位置へ音を追加して和音を作成
- 休符入力
- 全音符 / 2分音符 / 4分音符 / 8分音符
- ♭ / ♮ / ♯
- 3/4 / 4/4
- 30〜300 BPM
- Undo / Redo
- AまたはBの音律で譜面を再生
- 再生カーソル
- 正弦波 / やわらかい倍音 / 豊かな倍音
- 日本語 / 英語、端末内設定保存
- 実行時の外部通信なし

## プライバシー

譜面、周波数、音律設定はブラウザ内で処理します。外部API、CDN、分析、テレメトリへの実行時通信はありません。

## 開発

編集元は `src/index.template.html` です。生成済みHTMLは手動編集しません。

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
pwsh -NoProfile -File .\scripts\check-repository.ps1
```

## 開発予定

- v0.5.0: Mobile / Score UX
- v0.6.0: WAV Export
- v0.7.0: Custom Tuning / Project Data
- v0.8.0: UX / Learning Support
- v0.9.0: Release Candidate
- v1.0.0: Formal Release

## License

MIT
