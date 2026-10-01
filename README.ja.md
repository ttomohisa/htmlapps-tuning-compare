# 音律聞き比べ / Tuning Compare

平均律・純正律・カスタム音律をA/Bで聞き比べ、短い譜面や数値を使って違いを確認できるBrowser Kitty向けブラウザアプリです。

**v0.8.0 は UX / Learning Support の開発段階です。**

## v0.8.0で追加したこと

### 聞きどころ

A/B比較中の音から自動で、

- 最大cent差
- その音名
- BがAより高い / 低い
- 最大Hz差

を表示します。

「純正律の方が良い」のような評価はせず、現在の設定で実際にどの音がどれだけ違うかを示します。

比較対象に応じて、長三度・完全五度・長三和音それぞれの短い聞き方のヒントも表示します。

### サンプル譜面

4種類を追加しました。

- **長三度** — C4 + E4を長く鳴らす
- **長三和音** — C4 + E4 + G4を長く鳴らす
- **Cメジャースケール** — C4からC5まで4分音符で上行
- **I–IV–V–I** — C / F / G / Cの和音進行

既に譜面がある場合は、サンプルで置き換える前に確認します。

読み込み後もUndoで元の譜面へ戻せます。

## 既存機能

- 12平均律
- 5-limit純正律
- カスタム音律のHz / 比率 / cent編集
- A/B聞き比べ
- 2小節の簡易譜面
- スマホ4ページUI
- Undo / Redo
- Aのみ / Bのみ / A→B WAV
- プロジェクトJSON
- 日本語 / 英語
- 端末内自動保存

## プライバシー

譜面、音律、比較計算、JSON、WAVはブラウザ内で処理します。入力内容や生成音声を外部へ送信しません。

## 開発

編集元は `src/index.template.html` です。生成済みHTMLは手動編集しません。

```powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File .\scripts\check-powershell-syntax.ps1
pwsh -NoProfile -File .\scripts\check-repository.ps1
```

## 開発予定

- v0.9.0: Release Candidate
- v1.0.0: Formal Release

## License

MIT
