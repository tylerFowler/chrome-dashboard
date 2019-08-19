import React from 'react';
import hexToRGB from 'hex-rgb';
import { defaultTheme, PanelThemeCustomization, RGB } from '../../panel/panelTheme';
import { SettingInput } from './SettingsForm';

type InputHTMLAttributeSubset = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'|'onChange'|'value'>;

export interface PanelThemeInputProps extends InputHTMLAttributeSubset {
  readonly value: string|PanelThemeCustomization;
  onChange?(updatedTheme: PanelThemeCustomization): void;
}

const customInputCSS: React.CSSProperties = {
  padding: 0,
  height: '1.75em',
  verticalAlign: 'sub',
};

const valueIsTheme = (value: PanelThemeInputProps['value']): value is PanelThemeCustomization =>
  value && value.hasOwnProperty('primaryColor');

// getLightnessValue computes a percentage decimal from 0 to 1 on how "light" a
// given RGB value is, using the perceived lightness (Luma) calculations based on
// the sRGB Luma algorithm:
// https://css-tricks.com/switch-font-color-for-different-backgrounds-with-css/#article-header-id-6
const getLightnessValue = ({ red, green, blue }: RGB): number =>
  (red * .2126 + green * 0.7152 + blue * 0.0722) / 255;

// PanelThemeInput is an input that can be used to choose a color scheme to use
// for a Panel, generating the theme on the fly.
const PanelThemeInput: React.FC<PanelThemeInputProps> = ({ onChange, value, ...inputProps}) => {
  const inputValue = valueIsTheme(value)
    ? value.primaryColor
    : value || '';

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hexColor = event.target.value;
    const rgbColor = hexToRGB(hexColor);

    onChange({
      primaryColor: hexColor,
      primaryColorRGB: rgbColor,
      fontColor: getLightnessValue(rgbColor) > .5
        ? defaultTheme.typeDark
        : defaultTheme.typeLight,
    });
  };

  return <SettingInput {...inputProps} type="color" onChange={onInputChange} value={inputValue}
    style={{ ...customInputCSS, ...inputProps.style }}
  />;
};

export default PanelThemeInput;
