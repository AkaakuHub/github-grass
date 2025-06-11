# GitHub Grass Generator

GitHubのコントリビューショングラフを様々な色でSVG形式で生成するツールです。

## 使い方

1. 環境変数を設定：
   ```bash
   export TOKEN=your_github_token
   export USERNAME=your_github_username
   ```

2. スクリプトを実行：
   ```bash
   python generate_grass.py --color blue
   ```

## 利用可能な色

- `blue` (デフォルト): 青系のグラデーション
- `red`: 赤系のグラデーション  
- `green`: 緑系のグラデーション
- `white`: 白系のグラデーション

## 必要なライブラリ

```bash
pip install requests svgwrite numpy
```

---

# GitHub Grass Generator

A tool to generate GitHub contribution graphs as SVG files with various color palettes.

## Usage

1. Set environment variables:
   ```bash
   export TOKEN=your_github_token
   export USERNAME=your_github_username
   ```

2. Run the script:
   ```bash
   python generate_grass.py --color blue
   ```

## Available Colors

- `blue` (default): Blue gradient
- `red`: Red gradient
- `green`: Green gradient
- `white`: White gradient

## Required Libraries

```bash
pip install requests svgwrite numpy
```