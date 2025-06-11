# GitHub Grass Generator

GitHubのコントリビューショングラフを様々な色でアニメーション付きSVG形式で生成するツールです。TypeScript + D3.jsで実装されています。

## 特徴

✅ **SMILアニメーション**: ブラウザネイティブのSVGアニメーション  
✅ **複数カラーパレット**: blue, red, green, whiteから選択可能  
✅ **GitHub Actions対応**: 自動生成とコミット機能  
✅ **高速なTypeScript**: D3.jsとjsdomを使用した効率的な生成  

## セットアップ

### 依存関係のインストール
```bash
pnpm install
```

### プロジェクトのビルド
```bash
pnpm build
```

## 使い方

### 1. 環境変数の設定
```bash
export TOKEN=your_github_token
export USERNAME=your_github_username
```

### 2. 基本的な使用方法
```bash
# デフォルト（青色、アニメーションなし）
pnpm generate

# アニメーション付きで生成
pnpm generate -- --animated

# 緑色でアニメーション付き
pnpm generate -- --color green --animated

# モックデータを使用してテスト
pnpm generate -- --mock --animated --color red
```

### 3. テスト用SVG生成
```bash
pnpm test
```

## コマンドオプション

### カラーパレット（`--color`）
- `blue`（デフォルト）: 青系のグラデーション
- `red`: 赤系のグラデーション  
- `green`: 緑系のグラデーション
- `white`: 白/グレー系のグラデーション

### アニメーション（`--animated`）
- SMILアニメーションを追加します
- 各矩形が順番にフェードインします

### モックデータ（`--mock`）
- GitHub APIを使わずにランダムなテストデータを生成します
- 開発・テスト用途に便利です
## ファイル構造

```
src/
├── index.ts           # メインエントリーポイント
├── grass-generator.ts # SVG生成ロジック  
├── github-api.ts      # GitHub API クライアント
├── test.ts           # テスト用スクリプト
├── types/
│   └── github.ts     # 型定義
└── const/
    └── theme.ts      # カラーパレット定義
```

## 生成されるファイル

- `github-glass.svg`: 生成されたコントリビューショングラフ
- `test-grass.svg`: テスト用に生成されたサンプル

## スクリプト

- `pnpm build`: TypeScriptをコンパイル
- `pnpm start`: メインスクリプトを実行
- `pnpm generate`: ビルドして実行
- `pnpm test`: テスト用SVGを生成

## GitHub Actions

`.github/workflows/run.yml`で自動実行が設定されています：

- プッシュ時にも実行
- 生成されたSVGを自動コミット

## 注意事項

- GitHub APIトークンが必要です
- プライベートリポジトリのコントリビューションは含まれません
