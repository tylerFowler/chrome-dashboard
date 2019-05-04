import React from 'react';
import { WeatherLocation } from '../../interface';
import LocationEditor from './LocationEditor';
import SettingsForm, { SettingField, SettingLabel, SettingInput } from '../SettingsForm';

export interface WeatherSettings {
  readonly openWeatherAPIKey: string;
  setOpenWeatherAPIKey(key: string): void;

  readonly location: Readonly<WeatherLocation>;
  setLocationConfig(loc: Readonly<WeatherLocation>): void;
}

// TODO: Add a reusable way to do an "about" hover field
const APIKeySetting: React.SFC<{ readonly apiKey: string; onChange(key: string): void}> = ({ apiKey, onChange }) =>
  <SettingField>
    <SettingLabel htmlFor="weather-api-key">OpenWeather API Key</SettingLabel>
    <SettingInput id="weather-api-key" spellCheck={false} style={{width: '250px'}}
      value={apiKey} onChange={e => onChange(e.target.value)}
    />
  </SettingField>
;

const WeatherSettings: React.FC<Partial<WeatherSettings>> = () =>
  <SettingsForm>
    <legend>Weather</legend>

    <APIKeySetting apiKey="" onChange={console.log} />

    {/* TODO: style this */}
    <fieldset>
      <SettingField>
        <SettingLabel>Location</SettingLabel>
        <LocationEditor updateConfig={console.log} />
      </SettingField>
    </fieldset>
  </SettingsForm>
;

export default WeatherSettings;
