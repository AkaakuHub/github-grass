export interface Theme {
  background: string;
  text: string;
  border: string;
}

export const themes: Record<string, Theme> = {
  light: {
    background: "#ffffff",
    text: "#24292f",
    border: "#d0d7de",
  },
  dark: {
    background: "#0d1117",
    text: "#f0f6fc",
    border: "#30363d",
  },
};

export const COLOR_PALETTES = {
  blue: [
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
  red: [
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
  green: [
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
  white: [
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
};
