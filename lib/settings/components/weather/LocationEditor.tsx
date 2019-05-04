import React, { useState, useReducer } from 'react';
import styled from 'lib/styled-components';
import { WeatherLocation, WeatherLocationType } from '../../interface';
import CityEditor from './CityEditor';
import { SettingFieldGroup, SettingSelect, SettingsSubmitButton } from '../SettingsForm';

function locationEditorReducer(config: WeatherLocation, action: any): WeatherLocation {
  switch (action.type) {
  case 'updateCity':
    return { ...config, value: action.city };
  default:
    return config;
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
      onCityNameChange={city => dispatch({ type: 'updateCity', city })}
      displayName={configState.displayName}
      onDisplayNameChange={displayName => dispatch({ type: 'updateDisplayName', displayName })}
    />;
    break;
  default:
    break;
  }

  // TODO: this should collect updates from it's sub components
  const locationUpdateSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    updateConfig(null);
  };

  // TODO: display a "current weather with current settings viewer" that lets
  // us pass specific things to it without committing them.
  // - Should be able to reuse the main weather card for this, though may need
  //   a more compact version of this
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

      <SettingsSubmitButton onClick={locationUpdateSubmit}>Save</SettingsSubmitButton>
  </>);
};

export default LocationEditor;
