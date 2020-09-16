# ChordWiki Plus

[ChordWiki](https://ja.chordwiki.org/)に機能を追加します。

![ChordWiki-Plus](/docs/screenshot_2400x1800@2x.jpg)

## 機能

- 🎼 移調ボタン
- 📝 表記変更ボタン
- 📋 URL コピーボタン
- ➖ スクロールガイド
- 🎸 コードダイアグラム表示
- 🔗 移調テキストの自動リンク化
- 📜 自動スクロールボタン
- 🎦 YouTube のインライン再生
- 🎦 ニコニコ動画のインライン再生
- 🥁 簡易メトロノーム
- 🔍 検索フォーム

## 対応ブラウザ

- ✅ Google Chrome （[Google Chrome 版をインストール](https://chrome.google.com/webstore/detail/chordwiki-plus-chordwiki%E3%81%8C/okpomplfbfbmabonmfloendefonobaco?hl=ja)）
- ✅ Mozilla Firefox（申請中）
- ✅ Opera（申請中）
- ✅ Microsoft Edge（申請中）

## 開発の始め方

```
npm install
npm run watch:dev
```

`dist` をブラウザに読み込ませ、`src` ディレクトリのファイルを編集してください。

## ビルド手順

```
npm install
npm run build
npm run build-zip
```

`dist-zip` ディレクトリに各ブラウザ用のパッケージがビルドされます。
