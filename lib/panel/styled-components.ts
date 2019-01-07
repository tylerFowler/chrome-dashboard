import * as styledComponents from 'styled-components';
import { ThemedStyledComponentsModule } from 'styled-components';
import PanelTheme from './panelTheme';

const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider,
} = styledComponents as ThemedStyledComponentsModule<PanelTheme>;

export { css, createGlobalStyle, keyframes, ThemeProvider };
export default styled;
