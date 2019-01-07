import { Ratio, Scale } from 'natural-scale';

export const fontSize = 16;
export const fontFamily = "Lora, 'Times New Roman', Times, Georgia, serif";

export const typeScale = Scale({
  base: fontSize,
  interval: Ratio.MAJOR_THIRD,
  unit: 'px',
});

export const fontStacks = {
  Montserrat: 'Montserrat, Helvetica, Verdana, sans-serif',
  OpenSans: "'Open Sans', 'Helvetica Neue', Helvetica, Verdana, sans-serif",
};

// TODO see if we can replace this w/ a theme
export const colors = {
  backgroundMain: '#f0f0f0',

  typeDark: '#404040',
  typeDarkLight: '#a0a0a0',

  borderDarkLight: '#767676',
};
