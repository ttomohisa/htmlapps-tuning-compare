# 音律聞き比べ / Tuning Compare

平均律・純正律・カスタム音律を聞き比べ、短い譜面でも違いを確認できるBrowser Kitty向けブラウザアプリです。

**v0.5.0 は Mobile / Score UX の開発段階です。** スマートフォンでは長い1ページを縦に追うのではなく、`比較 / 譜面 / 音律 / 音` の4ページを下部タブで切り替えます。

## v0.5.0でできること

- スマホ用の4ページ固定ボトムナビ
- Safe Area対応
- PCでは従来どおり全セクションを通常表示
- スマホでは2小節を1小節ずつ2段表示
- 横スクロール不要の譜面入力
- 選択中の音符・和音・休符を下部ナビ直上で編集
- 固定編集バーから音価変更・削除
- 削除 / 譜面クリア後のToast + Undo
- A / Bそれぞれの12平均律、5-limit純正律、カスタム音律
- A/B聞き比べ
- 2小節の簡易譜面
- 休符、和音、♭ / ♮ / ♯
- 全音符 / 2分 / 4分 / 8分
- 3/4 / 4/4、30〜300 BPM
- AまたはBの音律で譜面再生
- 日本語 / 英語
- 端末内自動保存
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

- v0.6.0: WAV Export
- v0.7.0: Custom Tuning / Project Data
- v0.8.0: UX / Learning Support
- v0.9.0: Release Candidate
- v1.0.0: Formal Release

## License

MIT
