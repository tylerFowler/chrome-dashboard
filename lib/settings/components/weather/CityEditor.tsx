import React from 'react';
import { SettingField, SettingLabel, SettingInput } from '../SettingsForm';

export interface CityLocationEditorProps {
  readonly cityName: string;
  onCityNameChange(city: string): void;

  readonly displayName?: string;
  onDisplayNameChange(displayName: string): void;
}

const CityLocationEditor: React.FC<CityLocationEditorProps> = props => <>
  <SettingField>
    <SettingLabel htmlFor="weather-loc-city-name">City</SettingLabel>
    <SettingInput id="weather-loc-city-name" value={props.cityName}
      onChange={e => props.onCityNameChange(e.target.value)}
    />
  </SettingField>

  <SettingField>
    <SettingLabel htmlFor="weather-loc-display-name">Display Name</SettingLabel>
    <SettingInput id="weather-loc-city-name" value={props.displayName || ''}
      onChange={e => props.onDisplayNameChange(e.target.value)}
    />
  </SettingField>
</>;

export default CityLocationEditor;
