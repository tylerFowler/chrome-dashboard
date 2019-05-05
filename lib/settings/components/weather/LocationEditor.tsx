import React, { useReducer } from 'react';
import styled from 'lib/styled-components';
import { WeatherLocation, WeatherLocationType } from '../../interface';
import Spinner from 'lib/styled/Spinner';
import { SettingFieldGroup, SettingSelect, SettingsSubmitButton } from '../SettingsForm';
import LocationEditorDispatch from './locationEditorDispatch';
import CityEditor from './CityEditor';
import ZIPCodeEditor from './ZIPCodeEditor';
import CoordsEditor from './CoordsEditor';
import CurrentLocEditor from './CurrentLocEditor';

// TODO: add action types
type State = WeatherLocation & { isWaiting: boolean };

function locationEditorReducer(state: State, action: { type: string, payload: any }): State {
  switch (action.type) {
  case 'updateCity':
  case 'updateZipCode':
  case 'updateCoords':
    return { ...state, value: action.payload };
  case 'updateDisplayName':
    return { ...state, displayName: action.payload };
  case 'updateCountryCode':
    return { ...state, countryCode: action.payload };
  case 'waiting':
    return { ...state, isWaiting: action.payload };
  case 'setType':
    return {
      type: action.payload, value: '', displayName: '', countryCode: '',
      isWaiting: false,
    };
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
  const initialState: State = { ...config, isWaiting: false };
  const [ state, dispatch ] = useReducer(locationEditorReducer, initialState);

  let locationConfigControl: React.ReactElement;
  switch (state.type) {
  case WeatherLocationType.CityName:
    locationConfigControl = <CityEditor
      cityName={state.value}
      displayName={state.displayName}
      countryCode={state.countryCode}
    />;
    break;
  case WeatherLocationType.ZIPCode:
    locationConfigControl = <ZIPCodeEditor
      zip={state.value}
      displayName={state.displayName}
      countryCode={state.countryCode}
    />;
    break;
  case WeatherLocationType.Coords:
    locationConfigControl = <CoordsEditor
      lat={state.value.split(',')[0] || ''}
      lon={state.value.split(',')[1] || ''}
      displayName={state.displayName}
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
    dispatch({ type: 'reset', payload: initialState });
  };

  const locationUpdateSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    updateConfig(state);
  };

  // TODO: display a "current weather with current settings viewer" that lets
  // us pass specific things to it without committing them.
  // - Should be able to reuse the main weather card for this, though may need
  //   a more compact version of this
  return (
    <LocationEditorDispatch.Provider value={dispatch}>
      <SettingSelect value={state.type}
        onChange={e => dispatch({ type: 'setType', payload: e.target.value as WeatherLocationType })}
      >
        <option value={WeatherLocationType.CityName} defaultChecked={true}>City Name</option>
        <option value={WeatherLocationType.ZIPCode}>ZIP Code</option>
        <option value={WeatherLocationType.Coords}>Lat/Long Coordinates</option>
        <option value={WeatherLocationType.Current}>Current</option>
      </SettingSelect>

      {state.isWaiting &&
        <span style={{marginLeft: '.75rem'}}>
          <Spinner style={{verticalAlign: 'top'}} />
        </span>
      }

      <LocationEditorFieldGroup>
        {locationConfigControl}
      </LocationEditorFieldGroup>

      <button type="reset" onClick={resetEditorToStored}>Reset</button>
      <SettingsSubmitButton onClick={locationUpdateSubmit}>Save</SettingsSubmitButton>
    </LocationEditorDispatch.Provider>
  );
};

export default LocationEditor;
