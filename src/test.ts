import { GitHubAPI } from "./github-api.js";
import { generateSvg } from "./grass-generator.js";
import { writeFileSync } from "fs";

async function test() {
  console.log("テスト用草グラフを生成中...");

  const githubAPI = new GitHubAPI("", "");
  const mockData = githubAPI.generateMockData();

  const svgContent = generateSvg(mockData, {
    colorPalette: "blue",
    animated: true,
    displayWeekCount: 20,
  });

  writeFileSync("test-grass.svg", svgContent);
  console.log("テストSVGファイルを生成しました: test-grass.svg");
}

test().catch(console.error);
