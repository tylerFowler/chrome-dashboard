import React, { useReducer } from 'react';
import styled from 'lib/styled-components';
import { WeatherLocation, WeatherLocationType } from '../../../weather/interface';
import Spinner from 'lib/styled/Spinner';
import * as Alert from 'lib/styled/Alert';
import WeatherCardPreview from '../../containers/WeatherCardPreview';
import { WeatherCardContainer } from '../../../weather/components/WeatherCard';
import { SettingFieldGroup, SettingSelect, SettingButton } from '../SettingsForm';
import LocationEditorDispatch from './locationEditorDispatch';
import CityEditor from './CityEditor';
import ZIPCodeEditor from './ZIPCodeEditor';
import CoordsEditor from './CoordsEditor';
import CurrentLocEditor from './CurrentLocEditor';

// TODO: add action types
type State = WeatherLocation & {
  isWaiting: boolean,
  isValid: boolean,
  warning?: string,
  error?: string,
};

function locationEditorReducer(state: State, action: { type: string, payload: any }): State {
  let newState: State = state;
  switch (action.type) {
  case 'updateCity':
  case 'updateZipCode':
  case 'updateCoords':
    newState = { ...state, value: action.payload };
    break;
  case 'updateDisplayName':
    newState = { ...state, displayName: action.payload };
    break;
  case 'updateDefaultDisplayName':
    newState = { ...state, displayName: state.displayName || action.payload };
    break;
  case 'updateCountryCode':
    newState = { ...state, countryCode: action.payload.trim() };
    break;
  case 'waiting':
    newState = { ...state, isWaiting: action.payload };
    break;
  case 'setType':
    newState = {
      type: action.payload, value: '', displayName: '', countryCode: '',
      isWaiting: false, isValid: false,
    };
    break;
  case 'setWarning':
    newState = { ...state, warning: action.payload };
    break;
  case 'unsetWarning':
    delete newState.warning;
    break;
  case 'forecastFetched':
  case 'forecastFetchSuccess':
    newState = { ...state, error: null, warning: null };
    break;
  case 'forecastFetchFailure':
    newState = { ...state, error: action.payload };
    break;
  case 'reset':
    newState = action.payload;
    break;
  default:
    throw new Error(`Unknown action type ${action.type}`);
  }

  let isValid = false;
  switch (newState.type) {
  case WeatherLocationType.CityName:
    isValid = WeatherLocation.isCity(newState);
    break;
  case WeatherLocationType.ZIPCode:
    isValid = WeatherLocation.isZIPCode(newState);
    break;
  case WeatherLocationType.Coords:
  case WeatherLocationType.Current:
    isValid = WeatherLocation.isCoords(newState);
    break;
  }

  return { ...newState, isValid };
}

export interface LocationEditorProps {
  readonly config: WeatherLocation;
  updateConfig(update: WeatherLocation): void;
}

const LocationEditorFieldGroup = styled(SettingFieldGroup)`
  margin: 1em .5em 1em 0;
`;

const PreviewContainer = styled.aside`
  zoom: .75;
  overflow: hidden;
  margin-top: 1em;

  & > ${WeatherCardContainer} {
    border: 2px solid ${props => props.theme.borderDark};
    border-radius: 3px;
  }
`;

const LocationEditor: React.FC<Partial<LocationEditorProps>> = ({ config, updateConfig = () => {} }) => {
  const initialState: State = { ...config, isWaiting: false, isValid: true };
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
      {...state.value}
      displayName={state.displayName}
    />;
    break;
  case WeatherLocationType.Current:
    locationConfigControl = <CurrentLocEditor
      {...state.value}
    />;
    break;
  default:
    break;
  }

  const resetEditorToStored = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    event.currentTarget.blur();
    dispatch({ type: 'reset', payload: initialState });
  };

  const locationUpdateSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    event.currentTarget.blur();
    updateConfig(state);
  };

  return (
    <LocationEditorDispatch.Provider value={dispatch}>
      {state.warning && <Alert.Warning style={{margin: '0 auto 1.5em'}}>{state.warning}</Alert.Warning>}
      {state.error && <Alert.Error style={{margin: '0 auto 1.5em'}}>{state.error}</Alert.Error>}

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

      <SettingButton type="reset" onClick={resetEditorToStored}>Reset</SettingButton>
      <SettingButton onClick={locationUpdateSubmit} disabled={!state.isValid}>Save</SettingButton>

      <PreviewContainer>
        <WeatherCardPreview location={state} />
      </PreviewContainer>
    </LocationEditorDispatch.Provider>
  );
};

export default LocationEditor;
