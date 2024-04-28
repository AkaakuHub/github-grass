# generate_contribution_graph.py
import os
import requests
import json
import svgwrite
import numpy as np

GITHUB_TOKEN = os.getenv("TOKEN")
GITHUB_USERNAME = os.getenv("USERNAME")


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


def generate_svg(contribution_data):
    dwg = svgwrite.Drawing("github-glass.svg", profile="tiny")
    colors = [
        "#d7d9db",
        "#c6f9bb",
        "#9be9a8",
        "#40e463",
        "#40c463",
        "#30b14e",
        "#30a14e",
        "#218e39",
        "#216e39",
    ]

    display_week_count = 20
    
    weeks_count = len(contribution_data)
    # 最大30週間分のデータを取得
    rest_weeks = weeks_count - display_week_count if weeks_count > display_week_count else weeks_count
    count = 0

    # 背景に、グレーでrectを描画
    dwg.add(
        dwg.rect(insert=(0, 0), size=(12 * display_week_count + 2, 84 + 2), fill="#ffffff", rx=2, ry=2)
    )

    for i, week in enumerate(contribution_data):
        if count < rest_weeks:
            count += 1
            continue
        for j, day in enumerate(week["contributionDays"]):
            color = colors[min(day["contributionCount"], len(colors) - 1)]
            dwg.add(
                dwg.rect(
                    insert=((i - count) * 12 + 2, j * 12 + 2),
                    size=(10, 10),
                    fill=color,
                    rx=2,
                    ry=2,
                )
            )

    github_mark = """
    <circle cx="122.3" cy="42" fill="#ffffff" r="39" />
    <path fill-rule="evenodd" clip-rule="evenodd" transform="scale(0.8, 0.8) translate(104, 3)"
        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
        fill="#000000" />
    """

    github_grass = dwg.tostring()
    github_grass = github_grass.replace("</svg>", github_mark + "</svg>")

    # github-grass.svgを保存
    with open("github-glass.svg", "w") as f:
        f.write(github_grass)


def main():
    contribution_data = get_contribution_data()
    generate_svg(contribution_data)


if __name__ == "__main__":
    main()
