import os
import requests
import json
import svgwrite
import argparse

GITHUB_TOKEN = os.getenv("TOKEN")
GITHUB_USERNAME = os.getenv("USERNAME")

# カラーパレット定義
COLOR_PALETTES = {
    "blue": [
        "#d7e3fb",
        "#bbddf9",
        "#a8c9f0",
        "#63a4f4",
        "#5393e3",
        "#4a81d9",
        "#3f72cc",
        "#2f5db8",
        "#1f4799",
    ],
    "red": [
        "#fdd8d8",
        "#fbb3b3",
        "#f99b9b",
        "#f67878",
        "#f45555",
        "#f23333",
        "#f01111",
        "#cc0e0e",
        "#a80b0b",
    ],
    "green": [
        "#d8f5d8",
        "#b3ebb3",
        "#9be19b",
        "#78d778",
        "#55cd55",
        "#33c333",
        "#11b911",
        "#0e9f0e",
        "#0b850b",
    ],
    "white": [
        "#ffffff",
        "#f0f0f0",
        "#e0e0e0",
        "#d0d0d0",
        "#c0c0c0",
        "#b0b0b0",
        "#a0a0a0",
        "#909090",
        "#808080",
    ],
}


def get_contribution_data():
    url = "https://api.github.com/graphql"
    headers = {"Authorization": f"Bearer {GITHUB_TOKEN}"}
    query = (
        """
    query {
        user(login: "%s") {
            contributionsCollection {
            contributionCalendar {
                weeks {
                contributionDays {
                    contributionCount
                    date
                    weekday
                }
                }
            }
            }
        }
    }
    """
        % GITHUB_USERNAME
    )
    response = requests.post(url, headers=headers, json={"query": query})
    data = json.loads(response.text)
    return data["data"]["user"]["contributionsCollection"]["contributionCalendar"][
        "weeks"
    ]


def generate_mock_data():
    """テスト用のモックデータを生成"""
    import random
    from datetime import datetime, timedelta

    weeks = []
    start_date = datetime.now() - timedelta(weeks=20)

    for week in range(20):
        week_data = {"contributionDays": []}
        for day in range(7):
            current_date = start_date + timedelta(weeks=week, days=day)
            contribution_count = random.randint(0, 8)
            week_data["contributionDays"].append(
                {
                    "contributionCount": contribution_count,
                    "date": current_date.strftime("%Y-%m-%d"),
                    "weekday": day,
                }
            )
        weeks.append(week_data)

    return weeks


def generate_svg(contribution_data, color_palette="blue", animated=False):
    dwg = svgwrite.Drawing("github-glass.svg", profile="tiny")
    colors = COLOR_PALETTES.get(color_palette, COLOR_PALETTES["blue"])

    display_week_count = 20

    weeks_count = len(contribution_data)
    print(f"Total weeks: {weeks_count}, Display weeks: {display_week_count}")

    # 最大30週間分のデータを取得
    rest_weeks = (
        weeks_count - display_week_count
        if weeks_count > display_week_count
        else 0
    )
    print(f"Rest weeks: {rest_weeks}")
    count = 0

    # viewBoxを設定
    dwg.viewbox(0, 0, 12 * display_week_count + 2, 84 + 2)

    # 背景に、グレーでrectを描画
    dwg.add(
        dwg.rect(
            insert=(0, 0),
            size=(12 * display_week_count + 2, 84 + 2),
            fill="#ffffff",
            rx=2,
            ry=2,
        )
    )

    rect_count = 0
    for i, week in enumerate(contribution_data):
        if count < rest_weeks:
            count += 1
            continue
        for j, day in enumerate(week["contributionDays"]):
            color = colors[min(day["contributionCount"], len(colors) - 1)]
            rect = dwg.rect(
                insert=((i - count) * 12 + 2, j * 12 + 2),
                size=(10, 10),
                fill=color,
                rx=2,
                ry=2,
            )

            if animated:
                # SMILアニメーション
                delay = ((i - count) * 7 + j) * 0.01

                # opacityアニメーション
                opacity_animate = dwg.animate(
                    attributeName="opacity",
                    from_="0",
                    to="1",
                    dur="0.3s",
                    begin=f"{delay}s",
                    fill="freeze",
                )
                rect.add(opacity_animate)

                # 初期状態を透明に設定
                rect["opacity"] = "0"

            dwg.add(rect)
            rect_count += 1

    print(f"Generated {rect_count} contribution rectangles")

    github_mark = """
    <circle cx="122.2" cy="41.7" fill="#ffffff99" r="39.1" />
    <path fill-rule="evenodd" clip-rule="evenodd" transform="scale(0.8, 0.8) translate(104, 3)"
        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
        fill="#00000099" />
    """

    # SVGを文字列として保存
    svg_content = dwg.tostring()
    svg_content = svg_content.replace("</svg>", github_mark + "</svg>")

    # github-grass.svgを保存
    with open("github-glass.svg", "w") as f:
        f.write(svg_content)


def main():
    parser = argparse.ArgumentParser(
        description="GitHubのコントリビューショングラフを生成します"
    )
    parser.add_argument(
        "--color",
        choices=list(COLOR_PALETTES.keys()),
        default="blue",
        help="カラーパレットを選択 (blue, red, green, white)",
    )
    parser.add_argument(
        "--animated", action="store_true", help="アニメーション効果を追加"
    )
    parser.add_argument(
        "--mock", action="store_true", help="モックデータを使用してテスト"
    )
    args = parser.parse_args()

    if args.mock:
        print("モックデータを使用してSVGを生成中...")
        contribution_data = generate_mock_data()
        print(f"モックデータ生成完了: {len(contribution_data)} weeks")
    else:
        print("GitHubからデータを取得中...")
        contribution_data = get_contribution_data()

    generate_svg(contribution_data, args.color, args.animated)

    animation_status = "（アニメーション付き）" if args.animated else ""
    data_source = "モックデータ" if args.mock else "GitHubデータ"
    print(f"SVGファイルを生成しました: github-glass.svg {animation_status}")
    print(f"データソース: {data_source}")
    print(f"カラーパレット: {args.color}")


if __name__ == "__main__":
    main()
