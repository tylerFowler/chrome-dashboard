import mainTheme, { AppTheme } from '../theme';

export interface RGB {
  red: number;
  green: number;
  blue: number;
}

export interface PanelThemeCustomization {
  primaryColor: string;
  primaryColorRGB: RGB;
  fontColor: string;
}

type PanelTheme = PanelThemeCustomization & AppTheme;

export default PanelTheme;

export const defaultTheme = {
  primaryColor: '#8a8a8a',
  primaryColorRGB: { red: 138, green: 138, blue: 138 },
  fontColor: mainTheme.typeLight,
  ...mainTheme,
};
