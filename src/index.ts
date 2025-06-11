import { GitHubAPI } from "./github-api.js";
import { generateSvg, GenerateSvgOptions } from "./grass-generator.js";
import { COLOR_PALETTES } from "./const/theme.js";
import { writeFileSync } from "fs";

async function main() {
  const token = process.env.TOKEN;
  const username = process.env.USERNAME;

  // コマンドライン引数の解析
  const args = process.argv.slice(2);
  const colorIndex = args.findIndex((arg) => arg === "--color");
  const animatedIndex = args.findIndex((arg) => arg === "--animated");
  const mockIndex = args.findIndex((arg) => arg === "--mock");

  const colorPalette = (
    colorIndex !== -1 && args[colorIndex + 1]
      ? args[colorIndex + 1]
      : "blue"
  ) as keyof typeof COLOR_PALETTES;
  const animated = animatedIndex !== -1;
  const useMock = mockIndex !== -1;

  const options: GenerateSvgOptions = {
    colorPalette,
    animated,
    displayWeekCount: 20,
  };

  try {
    let contributionData;
    const githubAPI = new GitHubAPI(token || "", username || "");

    if (useMock) {
      console.log("モックデータを使用してSVGを生成中...");
      contributionData = githubAPI.generateMockData();
      console.log(
        `モックデータ生成完了: ${contributionData.length} weeks`
      );
    } else {
      if (!token || !username) {
        console.error(
          "TOKEN and USERNAME environment variables are required"
        );
        process.exit(1);
      }
      console.log("GitHubからデータを取得中...");
      contributionData = await githubAPI.getContributionData();
    }

    const svgContent = generateSvg(contributionData, options);

    // SVGファイルを保存
    writeFileSync("github-glass.svg", svgContent);

    const animationStatus = animated ? "（アニメーション付き）" : "";
    const dataSource = useMock ? "モックデータ" : "GitHubデータ";
    console.log(
      `SVGファイルを生成しました: github-glass.svg ${animationStatus}`
    );
    console.log(`データソース: ${dataSource}`);
    console.log(`カラーパレット: ${colorPalette}`);
  } catch (error) {
    console.error("Error generating grass chart:", error);
    process.exit(1);
  }
}

main();
