# GitHub Grass Generator

GitHubのコントリビューションデータからSVGのグラフを生成します。色は表示範囲内の投稿数に合わせて変化します。

## 実行

```sh
pnpm install
pnpm generate -- --color blue --animated
```

GitHubデータを取得するには環境変数`TOKEN`と`USERNAME`を設定してください。生成ファイルは`github-glass.svg`です。

## オプション

- `--color`: `blue`、`red`、`green`、`white`から選択します。省略時は`blue`です。
- `--animated`: セルを順番に表示するアニメーションを追加します。
- `--mock`: GitHub APIを使わず、モックデータで生成します。

`pnpm test`はアニメーション付きのサンプルを`test-grass.svg`に生成します。
