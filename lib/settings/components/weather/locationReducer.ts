import { WeatherLocation, WeatherLocationType } from '../../../weather/interface';

// TODO: add action types
export type State = WeatherLocation & {
  isWaiting: boolean,
  isValid: boolean,
  warning?: string,
  error?: string,
};

// TODO: move this & its data structures to own file, add tests, maybe split up & combine
export default function locationEditorReducer(state: State, action: { type: string, payload: any }): State {
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
  case 'setError':
    newState = { ...state, error: action.payload.message };
    break;
  case 'unsetError':
    newState = { ...state, error: null };
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
