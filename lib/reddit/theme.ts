import PanelTheme, { defaultTheme } from '../panel/panelTheme';

export default {
  ...defaultTheme,
  primaryColor: '#0079d3', // default to the official Reddit blue
  primaryColorRGB: { red: 0, green: 121, blue: 211 },
  fontColor: defaultTheme.typeLight,
} as PanelTheme;
