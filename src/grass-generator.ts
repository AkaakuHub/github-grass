import * as d3 from "d3";
import { JSDOM } from "jsdom";
import { ContributionWeek } from "./types/github.js";
import { COLOR_PALETTES } from "./const/theme.js";

export interface GenerateSvgOptions {
  colorPalette?: keyof typeof COLOR_PALETTES;
  animated?: boolean;
  displayWeekCount?: number;
}

const TEXT_FONT_FAMILY =
  '"JetBrains Mono", "Fira Mono", "SFMono-Regular", Menlo, Consolas, monospace';

function hexToRgb(hex: string) {
  const sanitized = hex.replace("#", "");
  if (sanitized.length === 3) {
    const [r, g, b] = sanitized.split("");
    return {
      r: parseInt(r + r, 16),
      g: parseInt(g + g, 16),
      b: parseInt(b + b, 16),
    };
  }

  if (sanitized.length === 6) {
    return {
      r: parseInt(sanitized.slice(0, 2), 16),
      g: parseInt(sanitized.slice(2, 4), 16),
      b: parseInt(sanitized.slice(4, 6), 16),
    };
  }

  return null;
}

function getRelativeLuminance(hexColor: string): number {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return 0.5;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((value) => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getAccessibleTextColor(background: string) {
  const luminance = getRelativeLuminance(background);
  return luminance > 0.6 ? "#111827" : "#f8fafc";
}

export function generateSvg(
  contributionData: ContributionWeek[],
  options: GenerateSvgOptions = {}
): string {
  const {
    colorPalette = "blue",
    animated = false,
    displayWeekCount = 20,
  } = options;

  const colors = COLOR_PALETTES[colorPalette];
  const weeksCount = contributionData.length;
  console.log(
    `Total weeks: ${weeksCount}, Display weeks: ${displayWeekCount}`
  );

  // 最大30週間分のデータを取得
  const restWeeks =
    weeksCount > displayWeekCount ? weeksCount - displayWeekCount : 0;
  console.log(`Rest weeks: ${restWeeks}`);

  // Create DOM
  const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
  const document = dom.window.document;

  // Create SVG with D3
  const svg = d3
    .select(document.body)
    .append("svg")
    .attr("viewBox", `0 0 ${12 * displayWeekCount + 2} ${84 + 2}`)
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("profile", "tiny");

  // // 背景に、グレーでrectを描画
  // svg.append("rect")
  //   .attr("x", 0)
  //   .attr("y", 0)
  //   .attr("width", 12 * displayWeekCount + 2)
  //   .attr("height", 84 + 2)
  //   .attr("fill", "#ffffff")
  //   .attr("rx", 2)
  //   .attr("ry", 2);

  let rectCount = 0;
  let count = 0;

  contributionData.forEach((week, i) => {
    if (count < restWeeks) {
      count++;
      return;
    }

    week.contributionDays.forEach((day, j) => {
      const safeContribution = Number.isFinite(day.contributionCount)
        ? day.contributionCount
        : 0;
      const colorIndex = Math.min(
        Math.max(0, Math.floor(safeContribution / 2)),
        colors.length - 1
      );
      const color = colors[colorIndex];
      const cellX = (i - count) * 12 + 2;
      const cellY = j * 12 + 2;

      const rect = svg
        .append("rect")
        .attr("x", cellX)
        .attr("y", cellY)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", color)
        .attr("rx", 2)
        .attr("ry", 2);

      const animationDelay = ((i - count) * 7 + j) * 0.01;

      if (animated) {
        // SMILアニメーション
        rect.attr("opacity", "0");

        // opacityアニメーション
        rect.append("animate")
          .attr("attributeName", "opacity")
          .attr("from", "0")
          .attr("to", "1")
          .attr("dur", "0.3s")
          .attr("begin", `${animationDelay}s`)
          .attr("fill", "freeze");
      }

      const contributionLabel = String(day.contributionCount);
      const digitCount = contributionLabel.length;
      const fontSize = Math.max(3, 8 - digitCount);

      const text = svg
        .append("text")
        .attr("x", cellX + 5)
        .attr("y", cellY + 5.5)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", fontSize)
        .attr("font-family", TEXT_FONT_FAMILY)
        .attr("font-weight", digitCount <= 2 ? "600" : "500")
        .attr("fill", getAccessibleTextColor(color))
        .attr("pointer-events", "none")
        .text(contributionLabel);

      if (animated) {
        text.attr("opacity", "0");
        text
          .append("animate")
          .attr("attributeName", "opacity")
          .attr("from", "0")
          .attr("to", "1")
          .attr("dur", "0.3s")
          .attr("begin", `${animationDelay}s`)
          .attr("fill", "freeze");
      }

      rectCount++;
    });
  });

  console.log(`Generated ${rectCount} contribution rectangles`);

  // GitHub mark - Pythonコードと全く同じものを追加
  const githubMark = `
    <circle cx="122.25" cy="41.7" fill="#ffffff99" r="39.05" />
    <path fill-rule="evenodd" clip-rule="evenodd" transform="scale(0.8, 0.8) translate(104, 3)"
        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
        fill="#00000099" />
  `;

  // Get the SVG HTML and add GitHub mark
  const svgElement = document.querySelector("svg");
  if (svgElement) {
    // SVGを文字列として取得し、GitHub markを追加
    const svgString = svgElement.outerHTML.replace(
      "</svg>",
      githubMark + "</svg>"
    );
    return svgString;
  }

  return "";
}
