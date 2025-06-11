export interface GitHubContribution {
  date: string;
  contributionCount: number;
}

export interface ContributionDay {
  contributionCount: number;
  date: string;
  weekday: number;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  weeks: ContributionWeek[];
}

export interface ContributionsCollection {
  contributionCalendar: ContributionCalendar;
}

export interface GitHubUser {
  contributionsCollection: ContributionsCollection;
}

export interface GitHubApiResponse {
  data: {
    user: GitHubUser;
  };
}
