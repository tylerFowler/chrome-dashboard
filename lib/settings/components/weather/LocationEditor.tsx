import React, { useReducer } from 'react';
import styled from 'lib/styled-components';
import { WeatherLocation, WeatherLocationType } from '../../interface';
import LocationEditorDispatch from './locationEditorDispatch';
import { SettingFieldGroup, SettingSelect, SettingsSubmitButton } from '../SettingsForm';
import CityEditor from './CityEditor';
import ZIPCodeEditor from './ZIPCodeEditor';
import CoordsEditor from './CoordsEditor';
import CurrentLocEditor from './CurrentLocEditor';

function locationEditorReducer(config: WeatherLocation, action: any): WeatherLocation {
  switch (action.type) {
  case 'updateCity':
  case 'updateZipCode':
  case 'updateCoords':
    return { ...config, value: action.payload };
  case 'updateDisplayName':
    return { ...config, displayName: action.payload };
  case 'updateCountryCode':
    return { ...config, countryCode: action.payload };
  case 'setType':
    return { type: action.payload, value: '', displayName: '', countryCode: '' };
  case 'reset':
    return action.payload;
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

const LocationEditor: React.FC<Partial<LocationEditorProps>> = ({ config, updateConfig = () => {} }) => {
  const [ configState, dispatch ] = useReducer(locationEditorReducer, config);

  let locationConfigControl: React.ReactElement;
  switch (configState.type) {
  case WeatherLocationType.CityName:
    locationConfigControl = <CityEditor
      cityName={configState.value}
      displayName={configState.displayName}
      countryCode={configState.countryCode}
    />;
    break;
  case WeatherLocationType.ZIPCode:
    locationConfigControl = <ZIPCodeEditor
      zip={configState.value}
      displayName={configState.displayName}
      countryCode={configState.countryCode}
    />;
    break;
  case WeatherLocationType.Coords:
    locationConfigControl = <CoordsEditor
      lat={configState.value.split(',')[0] || ''}
      lon={configState.value.split(',')[1] || ''}
      displayName={configState.displayName}
    />;
    break;
  case WeatherLocationType.Current:
    locationConfigControl = <CurrentLocEditor />;
    break;
  default:
    break;
  }

  const resetEditorToStored = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    dispatch({ type: 'reset', payload: config });
  };

  const locationUpdateSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    updateConfig(configState);
  };

  // TODO: display a "current weather with current settings viewer" that lets
  // us pass specific things to it without committing them.
  // - Should be able to reuse the main weather card for this, though may need
  //   a more compact version of this
  return (
    <LocationEditorDispatch.Provider value={dispatch}>
      <SettingSelect value={configState.type}
        onChange={e => dispatch({ type: 'setType', payload: e.target.value as WeatherLocationType })}
      >
        <option value={WeatherLocationType.CityName} defaultChecked={true}>City Name</option>
        <option value={WeatherLocationType.ZIPCode}>ZIP Code</option>
        <option value={WeatherLocationType.Coords}>Lat/Long Coordinates</option>
        <option value={WeatherLocationType.Current}>Current</option>
      </SettingSelect>

      <LocationEditorFieldGroup>
        {locationConfigControl}
      </LocationEditorFieldGroup>

      <button type="reset" onClick={resetEditorToStored}>Reset</button>
      <SettingsSubmitButton onClick={locationUpdateSubmit}>Save</SettingsSubmitButton>
    </LocationEditorDispatch.Provider>
  );
};

export default LocationEditor;
