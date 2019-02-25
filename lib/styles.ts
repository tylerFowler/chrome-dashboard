import { Ratio, Scale } from 'natural-scale';

export const typeScale = Scale({
  base: 16,
  interval: Ratio.MAJOR_THIRD,
  unit: 'px',
});

export const fontStacks = {
  Montserrat: 'Montserrat, Helvetica, Verdana, sans-serif',
  OpenSans: "'Open Sans', 'Helvetica Neue', Helvetica, Verdana, sans-serif",
  Lora: "Lora, 'Times New Roman', Times, Georgia, serif",
  Monospace: "'Roboto Mono', 'Lucida Console', Monaco, monospace",
};

// TODO consider moving these to the theme definition
export const fontSize = '16px';
export const fontFamily = fontStacks.Lora;
