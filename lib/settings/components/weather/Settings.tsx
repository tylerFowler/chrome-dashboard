import React from 'react';
import styled from 'lib/styled-components';
import { typeScale } from 'lib/styles';
import { WeatherLocation } from '../../../weather/interface';
import LocationEditor from './LocationEditor';
import SettingsForm, { SettingField, SettingLabel, SettingInput } from '../SettingsForm';

export interface WeatherSettingsProps {
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

const LocationTypeFieldset = styled.fieldset`
  overflow: hidden;

  > legend {
    font-size: ${typeScale(4)};
    font-weight: bold;
    padding: 0 2em 0 1em;
  }
`;

const WeatherSettings: React.FC<WeatherSettingsProps> = ({
  openWeatherAPIKey, setOpenWeatherAPIKey,
  location, setLocationConfig,
}) =>
  <SettingsForm>
    <legend>Weather</legend>

    <APIKeySetting apiKey={openWeatherAPIKey} onChange={setOpenWeatherAPIKey} />

    <LocationTypeFieldset>
      <legend>Location Type</legend>

      <SettingField>
        <LocationEditor config={location} updateConfig={setLocationConfig} />
      </SettingField>
    </LocationTypeFieldset>
  </SettingsForm>
;

export default WeatherSettings;
