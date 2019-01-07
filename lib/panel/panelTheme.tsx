import mainTheme, { AppTheme } from '../theme';

export default interface PanelTheme extends AppTheme {
  primaryColor: string;
  fontColor: string;
}

export const defaultTheme = {
  primaryColor: '#8a8a8a',
  fontColor: mainTheme.typeLight,
  ...mainTheme,
};
