import React, { useState, useReducer } from 'react';
import styled from 'lib/styled-components';
import { WeatherLocation, WeatherLocationType } from '../../interface';
import LocationEditorDispatch from './locationEditorDispatch';
import { SettingFieldGroup, SettingSelect, SettingsSubmitButton } from '../SettingsForm';
import CityEditor from './CityEditor';

function locationEditorReducer(config: WeatherLocation, action: any): WeatherLocation {
  switch (action.type) {
  case 'updateCity':
    return { ...config, value: action.payload };
  case 'updateDisplayName':
    return { ...config, displayName: action.payload };
  case 'reset':
    return action.config;
  default:
    throw new Error(`Unknown action type ${action.type}`);
  }
}

export interface LocationEditorProps {
  readonly config: WeatherLocation;
  updateConfig(update: WeatherLocation): void;
}

const LocationEditorFieldGroup = styled(SettingFieldGroup)`
  margin: 1em .5em 1em 0;
`;

const LocationEditor: React.FC<Partial<LocationEditorProps>> = ({
  config = { type: WeatherLocationType.CityName },
  updateConfig = () => {},
}) => {
  const [ locType, setLocType ] = useState<WeatherLocationType>(config.type);
  const [ configState, dispatch ] = useReducer(locationEditorReducer, config);

  let locationConfigControl: React.ReactElement;
  switch (locType) {
  case WeatherLocationType.CityName:
    locationConfigControl = <CityEditor
      cityName={configState.value || ''}
      displayName={configState.displayName}
      countryCode={configState.countryCode || 'US'}
    />;
    break;
  default:
    break;
  }

  const locationUpdateSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    updateConfig({ ...configState, type: locType });
  };

  // TODO: display a "current weather with current settings viewer" that lets
  // us pass specific things to it without committing them.
  // - Should be able to reuse the main weather card for this, though may need
  //   a more compact version of this
  return (
    <LocationEditorDispatch.Provider value={dispatch}>
      <SettingSelect value={locType} onChange={e => setLocType(e.target.value as WeatherLocationType)}>
        <option value={WeatherLocationType.CityName} defaultChecked={true}>City Name</option>
        <option value={WeatherLocationType.ZIPCode}>ZIP Code</option>
        <option value={WeatherLocationType.Coords}>Lat/Long Coordinates</option>
        <option value={WeatherLocationType.Current}>Current</option>
      </SettingSelect>

      <LocationEditorFieldGroup>
        {locationConfigControl}
      </LocationEditorFieldGroup>

      <button type="reset" onClick={() => dispatch({ type: 'reset', config })}>Reset</button>
      <SettingsSubmitButton onClick={locationUpdateSubmit}>Save</SettingsSubmitButton>
    </LocationEditorDispatch.Provider>
  );
};

export default LocationEditor;
