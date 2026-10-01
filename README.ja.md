# 音律聞き比べ / Tuning Compare

12平均律・5-limit純正律・カスタム音律を、同じ音でA/B比較できるBrowser Kittyアプリです。4小節の簡易譜面、WAV出力、プロジェクトJSONまでブラウザ内で利用できます。

[English README](README.md)

![音律聞き比べのスクリーンショット](assets/screenshot.png)

![スマートフォン表示](assets/screenshot-mobile.png)

## 主な機能

- 同じ音・同じ音色・同じ音量条件で音律A / Bを比較
- 12平均律
- 主音を選べる5-limit純正律
- カスタム音律のHz / 比率 / cent編集
- A/Bの周波数差・cent差表示
- 4小節のト音記号ベース簡易譜面
- 単音・和音・休符
- 全音符・2分音符・4分音符・8分音符
- ♯ / ♭ / ♮
- 4/4・3/4拍子
- 比較用サンプル譜面
- 音律A / Bでの譜面再生
- 44.1 kHz / 48 kHz、16-bit mono WAV出力
- Aのみ / Bのみ / A → B比較WAV
- プロジェクトJSONの書き出し・読み込み
- Undo / Redo
- 端末内自動保存
- 日本語 / 英語UI
- 実行時の外部ネットワーク依存なし

## 使い方

1. 音律Aと音律Bを設定します。
2. 比較する音を選び、AまたはBを再生します。
3. 必要に応じて簡易譜面を編集し、短い旋律や和音進行で比較します。
4. 各音の周波数・比率・cent差を確認します。
5. カスタム音律の値を調整し、もう一度聞き比べます。
6. WAVとして書き出すか、プロジェクトJSONを保存します。

譜面機能は音律比較のための簡易入力です。本格的な楽譜制作、DAW、MIDIシーケンサーを目的としていません。

## プライバシー

譜面、音律設定、プロジェクトJSON、生成音声はブラウザ内で処理します。入力内容や生成した音声を外部へアップロードしません。単一HTML版では実行時ネットワーク接続もブロックします。

## 対応ブラウザ

主な対象:

- Chrome
- Edge

必要なWeb Audio APIが利用できる範囲で、現行のSafari / Firefoxにも対応します。

ブラウザの自動再生制限により、音声はユーザーが再生操作を行った後に開始します。

## 開発

編集元は `src/index.template.html` です。生成済みの単一HTMLは手動編集しません。

Windows PowerShell / PowerShell 7でリポジトリ検証を実行できます。

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
pwsh -NoProfile -File .\scripts\check-repository.ps1
```

## ビルド

```powershell
pwsh -NoProfile -File .\build-standalone.ps1
```

`app.config.json` で指定した単一HTMLに加えて、リポジトリ直下の `tuning-compare.html` を生成します。リポジトリ検証ではCSP、faviconとヘッダーアイコンの一致、未解決プレースホルダー、実行時ネットワーク遮断も確認します。

## License

MIT
