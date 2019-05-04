import React, { useState } from 'react';
import styled from 'lib/styled-components';
import { WeatherLocation, WeatherLocationType } from '../interface';
import SettingsForm, {
  SettingField, SettingFieldGroup, SettingLabel, SettingInput, SettingSelect,
  SettingsSubmitButton,
} from './SettingsForm';

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

const CityLocationEditor: React.FC = () => {
  const [ cityName ] = useState('');

  return (
    <span>City Location Editor {cityName}</span>
  );
};

// TODO: move this & it's parts to own file - or maybe move it's parts to own dir
export interface LocationEditorProps {
  readonly config: WeatherLocation;
  updateConfig(update: WeatherLocation): void;
}

const LocationEditorFieldGroup = styled(SettingFieldGroup)`
  margin: 1em .5em 1em 0;
`;

const LocationEditor: React.SFC<Partial<LocationEditorProps>> = ({
  config = { type: WeatherLocationType.CityName },
}) => {
  const [ locType, setLocType ] = useState<WeatherLocationType>(config.type);

  let locationConfigControl: React.ReactElement;
  switch (locType) {
  case WeatherLocationType.CityName:
    locationConfigControl = <CityLocationEditor />;
    break;
  default:
    break;
  }

  // TODO: display a "current weather with current settings viewer" that lets
  // us pass specific things to it without committing them.
  // TODO: display a reset to use the currently committed/saved/active config
  return (<>
      <SettingSelect value={locType} onChange={e => setLocType(e.target.value as WeatherLocationType)}>
        <option value={WeatherLocationType.CityName} defaultChecked={true}>City Name</option>
        <option value={WeatherLocationType.ZIPCode}>ZIP Code</option>
        <option value={WeatherLocationType.Coords}>Lat/Long Coordinates</option>
        <option value={WeatherLocationType.Current}>Current</option>
      </SettingSelect>

      <LocationEditorFieldGroup>
        {locationConfigControl}
      </LocationEditorFieldGroup>

      <SettingsSubmitButton onClick={e => e.preventDefault()}>Save</SettingsSubmitButton>
  </>);
};

const WeatherSettings: React.FC<Partial<WeatherSettings>> = () =>
  <SettingsForm>
    <legend>Weather</legend>

    <APIKeySetting apiKey="" onChange={console.log} />

    <SettingField>
      <SettingLabel>Location</SettingLabel>
      <LocationEditor />
    </SettingField>
  </SettingsForm>
;

export default WeatherSettings;
