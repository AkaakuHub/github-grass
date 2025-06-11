import fetch from "node-fetch";
import { ContributionWeek, GitHubApiResponse } from "./types/github.js";

export class GitHubAPI {
  private token: string;
  private username: string;

  constructor(token: string, username: string) {
    this.token = token;
    this.username = username;
  }

  async getContributionData(): Promise<ContributionWeek[]> {
    const query = `
      query($username: String!) {
        user(login: $username) {
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
    `;

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { username: this.username },
      }),
    });

    const data = (await response.json()) as GitHubApiResponse;

    if (!data.data || !data.data.user) {
      throw new Error("GitHub API error: Failed to fetch user data");
    }

    return data.data.user.contributionsCollection.contributionCalendar
      .weeks;
  }

  // モックデータを生成する関数（テスト用）
  generateMockData(): ContributionWeek[] {
    const weeks: ContributionWeek[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 20 * 7); // 20週前から

    for (let week = 0; week < 20; week++) {
      const contributionDays = [];
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + week * 7 + day);
        const contributionCount = Math.floor(Math.random() * 9); // 0-8のランダム

        contributionDays.push({
          contributionCount,
          date: currentDate.toISOString().split("T")[0],
          weekday: day,
        });
      }
      weeks.push({ contributionDays });
    }

    return weeks;
  }
}
