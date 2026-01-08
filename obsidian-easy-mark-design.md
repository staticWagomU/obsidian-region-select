# Obsidian Easy Mark プラグイン 設計ドキュメント

## 概要

**Easy Mark** は、Obsidianのモバイル環境における範囲選択の操作性を改善するプラグインです。Emacsのマーク＆ポイント方式にインスパイアされ、「始点（マーク）を設定 → 終点（現在位置）まで選択」という2ステップで範囲選択を実現します。

## 背景・動機

### 課題

モバイルデバイスでのテキスト範囲選択には以下の問題があります：

1. **タッチ操作の精度** - 小さな画面での正確な始点・終点の指定が困難
2. **ドラッグ操作の不安定さ** - 長い範囲を選択する際、スクロールとの競合が発生
3. **片手操作の限界** - 選択しながらの他の操作が難しい

### 解決策

Emacsの「マーク（mark）」と「ポイント（point）」の概念を導入：

- **マーク**: 選択範囲の始点を記録する固定点
- **ポイント**: 現在のカーソル位置（終点）

2つのコマンドに分離することで、以下のワークフローが可能になります：

1. 始点にカーソルを移動 → 「マーク設定」コマンド実行
2. 終点にカーソルを移動 → 「選択実行」コマンド実行
3. 選択されたテキストに対して操作（コピー、カット等）

## 機能要件

### 必須機能（MVP）

| 機能 | 説明 | コマンド名 |
|------|------|-----------|
| マーク設定 | 現在のカーソル位置を始点として保存 | `set-mark` |
| 選択実行 | 保存した始点から現在位置までを選択 | `select-to-mark` |
| マーク解除 | 設定したマークをクリア | `clear-mark` |

### 拡張機能（将来）

| 機能 | 説明 | 優先度 |
|------|------|--------|
| 視覚的マーク表示 | マーク位置をエディタ上でハイライト | 高 |
| マーク・ポイント入れ替え | カーソルとマーク位置をスワップ（Emacsの`C-x C-x`相当） | 中 |
| マークリング | 複数のマーク位置を履歴として保持 | 中 |
| 設定画面 | 動作カスタマイズ用のUI | 低 |

## 技術仕様

### 使用するObsidian API

```typescript
// Editor API（obsidianパッケージより）
interface Editor {
  // カーソル位置の取得
  getCursor(side?: 'from' | 'to' | 'head' | 'anchor'): EditorPosition;

  // カーソル位置の設定
  setCursor(pos: EditorPosition | number, ch?: number): void;

  // 選択範囲の設定（メインで使用）
  setSelection(anchor: EditorPosition, head?: EditorPosition): void;

  // 選択テキストの取得
  getSelection(): string;
}

// 位置情報
interface EditorPosition {
  line: number;  // 0始まりの行番号
  ch: number;    // 0始まりの文字位置（列）
}
```

### 依存関係

- Obsidian API: `^1.0.0`
- TypeScript: `^5.0.0`
- Node.js: `^18.0.0`（開発時）

## アーキテクチャ

### クラス構成

```
src/
├── main.ts              # プラグインエントリーポイント
├── mark-manager.ts      # マーク状態管理
├── commands.ts          # コマンド定義
├── ui/
│   └── notice.ts        # 通知表示ユーティリティ
└── types.ts             # 型定義
```

### 状態管理

```typescript
// mark-manager.ts
export class MarkManager {
  private mark: EditorPosition | null = null;

  setMark(pos: EditorPosition): void {
    this.mark = { ...pos };
  }

  getMark(): EditorPosition | null {
    return this.mark ? { ...this.mark } : null;
  }

  clearMark(): void {
    this.mark = null;
  }

  hasMark(): boolean {
    return this.mark !== null;
  }
}
```

### メインプラグイン

```typescript
// main.ts
import { Plugin, Editor, Notice } from 'obsidian';
import { MarkManager } from './mark-manager';

export default class EasyMarkPlugin extends Plugin {
  private markManager = new MarkManager();

  async onload() {
    this.registerCommands();
  }

  private registerCommands() {
    // マーク設定
    this.addCommand({
      id: 'set-mark',
      name: 'マークを設定（始点）',
      editorCallback: (editor: Editor) => {
        const pos = editor.getCursor();
        this.markManager.setMark(pos);
        new Notice(`マーク設定: 行 ${pos.line + 1}, 列 ${pos.ch + 1}`);
      }
    });

    // 選択実行
    this.addCommand({
      id: 'select-to-mark',
      name: 'マークまで選択（範囲確定）',
      editorCallback: (editor: Editor) => {
        const mark = this.markManager.getMark();
        if (!mark) {
          new Notice('マークが設定されていません');
          return;
        }
        const currentPos = editor.getCursor();
        editor.setSelection(mark, currentPos);
      }
    });

    // マーク解除
    this.addCommand({
      id: 'clear-mark',
      name: 'マークを解除',
      editorCallback: () => {
        this.markManager.clearMark();
        new Notice('マークを解除しました');
      }
    });
  }
}
```

## 実装ステップ

### Phase 1: MVP（最小限の実装）

1. **プロジェクトセットアップ**
   - Obsidianプラグインテンプレートからプロジェクト作成
   - TypeScript、ESLint設定

2. **コア機能実装**
   - MarkManagerクラスの実装
   - 3つの基本コマンド実装
   - Notice通知の実装

3. **テスト・デバッグ**
   - デスクトップでの動作確認
   - モバイル（iOS/Android）での動作確認

### Phase 2: UX改善

4. **視覚的フィードバック**
   - CodeMirror 6 Decorationを使ったマーク位置表示
   - StateFieldでの状態管理

5. **追加コマンド**
   - マーク・ポイント入れ替え機能

### Phase 3: 機能拡張

6. **マークリング**
   - 複数マークの履歴管理
   - 前のマークに戻る機能

7. **設定画面**
   - SettingTabの実装
   - 動作カスタマイズオプション

## モバイルでの使用方法

### コマンドパレット経由

1. 画面を下にスワイプしてコマンドパレットを開く
2. 「マーク」で検索
3. コマンドを選択して実行

### リボンメニュー経由（推奨）

[Commander](https://github.com/phibr0/obsidian-commander)プラグインと併用：

1. Commanderプラグインをインストール
2. リボンメニューに「マーク設定」「選択実行」を追加
3. ワンタップでコマンド実行可能に

### モバイルツールバー経由

1. Obsidian設定 → モバイル → ツールバー管理
2. 「コマンドを追加」から本プラグインのコマンドを追加

## ディレクトリ構成（完成時）

```
obsidian-easy-mark/
├── .github/
│   └── workflows/
│       └── release.yml
├── src/
│   ├── main.ts
│   ├── mark-manager.ts
│   ├── commands.ts
│   ├── ui/
│   │   └── notice.ts
│   └── types.ts
├── manifest.json
├── package.json
├── tsconfig.json
├── esbuild.config.mjs
├── README.md
└── LICENSE
```

## 参考リソース

### 公式ドキュメント

- [Obsidian Plugin Developer Docs](https://docs.obsidian.md/)
- [Obsidian API TypeScript Definitions](https://github.com/obsidianmd/obsidian-api)
- [Editor API Reference](https://docs.obsidian.md/Reference/TypeScript+API/Editor)

### 関連フォーラム

- [Get current text selection](https://forum.obsidian.md/t/get-current-text-selection/23436)
- [Set cursor position with API](https://forum.obsidian.md/t/is-there-a-way-to-set-cursor-position-with-api/8433)

### 参考プラグイン

- [obsidian-sample-plugin](https://github.com/obsidianmd/obsidian-sample-plugin) - 公式サンプル
- [obsidian-cursor-location-plugin](https://github.com/spslater/obsidian-cursor-location-plugin) - カーソル位置表示

## 変更履歴

| 日付 | バージョン | 内容 |
|------|-----------|------|
| 2025-01-09 | 0.1.0 | 初版作成 |
