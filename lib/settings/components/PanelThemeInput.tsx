import React from 'react';
import hexToRGB from 'hex-rgb';
import { defaultTheme, PanelThemeCustomization } from '../../panel/panelTheme';
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
  value.hasOwnProperty('primaryColor');

// PanelThemeInput is an input that can be used to choose a color scheme to use
// for a Panel, generating the theme on the fly.
//
// TODO: need to decide on whether to use the light font or dark font based on
// the color, can probably just avg together the RGB values, using dark font
// or light font at some threshold of brightness.
const PanelThemeInput: React.FC<PanelThemeInputProps> = ({ onChange, value, ...inputProps}) => {
  const inputValue = valueIsTheme(value)
    ? value.primaryColor
    : value || '';

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hexColor = event.target.value;

    onChange({
      primaryColor: hexColor,
      primaryColorRGB: hexToRGB(hexColor),
      fontColor: defaultTheme.fontColor,
    });
  };

  return <SettingInput {...inputProps} type="color" onChange={onInputChange} value={inputValue}
    style={{ ...customInputCSS, ...inputProps.style }}
  />;
};

export default PanelThemeInput;
