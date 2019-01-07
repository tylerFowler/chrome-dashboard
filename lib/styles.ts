import { Ratio, Scale } from 'natural-scale';

export const fontSize = 16;
export const fontFamily = "Lora, 'Times New Roman', Times, Georgia, serif";

export const typeScale = Scale({
  base: fontSize,
  interval: Ratio.MAJOR_THIRD,
  unit: 'em',
});

export const fontStacks = {
  Montserrat: 'Montserrat, Helvetica, Verdana, sans-serif',
};

export const colors = {
  backgroundMain: '#f0f0f0',
  fontColorMain: '#404040',
};
