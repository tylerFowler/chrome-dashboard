import mainTheme, { AppTheme } from '../theme';

export interface RGB {
  red: number;
  green: number;
  blue: number;
}

export default interface PanelTheme extends AppTheme {
  primaryColor: string;
  primaryColorRGB: RGB;
  fontColor: string;
}

export const defaultTheme = {
  primaryColor: '#8a8a8a',
  primaryColorRGB: { red: 138, green: 138, blue: 138 },
  fontColor: mainTheme.typeLight,
  ...mainTheme,
};
