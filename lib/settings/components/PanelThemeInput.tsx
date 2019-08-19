import React from 'react';
import hexToRGB from 'hex-rgb';
import { PanelThemeCustomization } from '../../panel/panelTheme';
import { SettingInput } from './SettingsForm';

type InputHTMLAttributeSubset = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'|'onChange'>;

export interface PanelThemeInputProps extends InputHTMLAttributeSubset {
  onChange?(updatedTheme: Partial<PanelThemeCustomization>): void;
}

const customInputCSS: React.CSSProperties = {
  padding: 0,
  height: '1.75em',
  verticalAlign: 'sub',
};

// PanelThemeInput is an input that can be used to choose a color scheme to use
// for a Panel, generating the theme on the fly.
//
// TODO: need to decide on whether to use the light font or dark font based on
// the color, can probably just avg together the RGB values, using dark font
// or light font at some threshold of brightness.
const PanelThemeInput: React.FC<PanelThemeInputProps> = ({ onChange, ...inputProps}) => {
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hexColor = event.target.value;

    onChange({
      primaryColor: hexColor,
      primaryColorRGB: hexToRGB(hexColor),
    });
  };

  return <SettingInput {...inputProps} type="color" onChange={onInputChange}
    style={{ ...customInputCSS, ...inputProps.style }}
  />;
};

export default PanelThemeInput;
