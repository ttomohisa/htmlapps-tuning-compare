# 音律聞き比べ / Tuning Compare

平均律・純正律・カスタム音律を、同じ音色・同じ再生位置で切り替えて聞き比べるBrowser Kitty向けブラウザアプリです。

**v0.3.0 は A/B Compare の開発段階です。** AとBの音律を独立して設定し、同時に開始した2つの音声レイヤーを切り替えることで、再生位置を変えずに聞き比べられます。

## v0.3.0でできること

- A / Bそれぞれに12平均律、5-limit純正律、カスタム音律を設定
- A / Bそれぞれの基準音・基準周波数・純正律の主音を独立設定
- カスタム音律はA / B別々にC4〜B4をHzで直接編集
- 長三度・完全五度・長三和音をワンタッチ比較
- AとBを同じAudioContext時刻から同時開始し、約24msのクロスフェードで切り替え
- A → Bの自動聞き比べ
- A / Bの実周波数とcent差を一覧表示
- v0.2.0のC4〜C5周波数表と単音試聴
- 任意Hzの単音・和音試聴
- 正弦波 / やわらかい倍音 / 豊かな倍音
- 日本語 / 英語、端末内設定保存
- 実行時の外部通信なし

## プライバシー

周波数、音律設定、操作内容はブラウザ内で処理します。外部API、CDN、分析、テレメトリへの実行時通信はありません。

## 開発

このリポジトリは `ttomohisa/htmlapps-template` の現在の構成に準拠し、`src/index.template.html` を編集元とします。生成済みHTMLは手動編集しません。

Windowsでの検証:

    powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
    pwsh -NoProfile -File .\scripts\check-repository.ps1

## 開発予定

- v0.4.0: Score Editor MVP
- v0.5.0: Mobile / Score UX
- v0.6.0: WAV Export
- v0.7.0: Custom Tuning / Project Data
- v0.8.0: UX / Learning Support
- v0.9.0: Release Candidate
- v1.0.0: Formal Release

## License

MIT
