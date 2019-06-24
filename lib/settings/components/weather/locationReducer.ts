import { WeatherLocation, WeatherLocationType } from '../../../weather/interface';

// TODO: add action types
export type State = WeatherLocation & {
  isWaiting: boolean,
  isValid: boolean,
  warning?: string,
  error?: string,
};

export default function locationEditorReducer(state: State, action: { type: string, payload: any }): State {
  const newState = reducer(state, action);
  return { ...newState, isValid: validityReducer(newState) };
}

function reducer(state: State, action: { type: string, payload: any }): State {
  switch (action.type) {
  case 'updateCity':
  case 'updateZipCode':
    return { ...state, value: action.payload };
  case 'updateCoords':
    return { ...state, value: action.payload, countryCode: null };
  case 'updateDisplayName':
    return { ...state, displayName: action.payload };
  case 'updateDefaultDisplayName':
    return { ...state, displayName: state.displayName || action.payload };
  case 'updateCountryCode':
    return { ...state, countryCode: action.payload.trim() };
  case 'waiting':
    return { ...state, isWaiting: action.payload };
  case 'setType':
    return {
      type: action.payload, isWaiting: false, isValid: false,
      value: '', displayName: '', countryCode: '',
    };
  case 'setWarning':
    return { ...state, warning: action.payload };
  case 'unsetWarning':
    return { ...state, warning: null };
  case 'setError':
    return { ...state, error: action.payload.message };
  case 'unsetError':
    return { ...state, error: null };
  case 'forecastFetched':
  case 'forecastFetchSuccess':
    return { ...state, error: null, warning: null };
  case 'forecastFetchFailure':
    return { ...state, error: action.payload };
  case 'reset':
    return action.payload;
  default:
    throw new Error(`Unknown action type ${action.type}`);
  }
}

function validityReducer(state: State): boolean {
  switch (state.type) {
  case WeatherLocationType.CityName:
    return WeatherLocation.isCity(state);
  case WeatherLocationType.ZIPCode:
    return WeatherLocation.isZIPCode(state);
  case WeatherLocationType.Coords:
  case WeatherLocationType.Current:
    return WeatherLocation.isCoords(state);
  default:
    return (state as State).isValid;
  }
}
