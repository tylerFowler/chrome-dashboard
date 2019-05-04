import React, { useState } from 'react';
import styled from 'lib/styled-components';
import { WeatherLocation, WeatherLocationType } from '../../interface';
import CityEditor from './CityEditor';
import { SettingFieldGroup, SettingSelect, SettingsSubmitButton } from '../SettingsForm';

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
  const [ locationSettings, setLocationSettings ] = useState<WeatherLocation>(config);

  // TODO: I think we could probably use useReducer to be able to more easily be
  // able to compute the local location settings before committing
  let locationConfigControl: React.ReactElement;
  switch (locType) {
  case WeatherLocationType.CityName:
    locationConfigControl = <CityEditor
      cityName={locationSettings.value || ''}
      onCityNameChange={city => setLocationSettings(prev => ({ ...prev, value: city }))}
      displayName={locationSettings.displayName}
      onDisplayNameChange={displayName => setLocationSettings(prev => ({ ...prev, displayName }))}
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
