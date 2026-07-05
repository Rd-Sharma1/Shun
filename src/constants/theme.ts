import { useFonts } from "expo-font";

export const Colors = {
  kanji: "#4a3528", //Dark Coffee
  macros: "#6e8b5d", //Dusty Olive
  accent: "#a63a32", //Brown Red

  text: "#262626", //Carbon Black

  primary: "#b85c22", //Autumn Ember
  surface: "#f7f3ec", //Parchment
  background: "#faf8f5", //Bright Snow
};

export const Spacing = {
  sm: 4,
  m: 8,
  l: 12,
  xl: 16,
  xxl: 20,
  big: 24,
};

export const Fonts = {
  regular: "IBMPlexSans-Regular",
  medium: "IBMPlexSans-Medium",
  bold: "IBMPlexSans-Bold",
  serif: "DMSerifDisplay-Regular",
  serifItalic: "DMSerifDisplay-Italic",
  japanese: "NotoSansJP-Regular",
};

export const fontConfig = {
  [Fonts.regular]: require("../../assets/fonts/IBM_Plex_Sans/static/IBMPlexSans-Regular.ttf"),
  [Fonts.medium]: require("../../assets/fonts/IBM_Plex_Sans/static/IBMPlexSans-Medium.ttf"),
  [Fonts.bold]: require("../../assets/fonts/IBM_Plex_Sans/static/IBMPlexSans-Bold.ttf"),
  [Fonts.serif]: require("../../assets/fonts/DM_Serif_Display/DMSerifDisplay-Regular.ttf"),
  [Fonts.serifItalic]: require("../../assets/fonts/DM_Serif_Display/DMSerifDisplay-Italic.ttf"),
};

export const useAppFonts = () => useFonts(fontConfig);
