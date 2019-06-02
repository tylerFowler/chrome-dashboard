import { Actions, WeatherAction } from './actions';
import { WeatherLocation, Forecast, WeatherLocationType } from './interface';

export interface State {
  readonly location: WeatherLocation;
  readonly fetchingForecast: boolean;
  readonly forecastFetchError: Error;

  readonly unit: 'F'|'C';
  readonly currentForecast: Partial<Forecast>;
  readonly futureForecast: Partial<Forecast>;
}

export const defaultState: State = {
  location: {
    type: WeatherLocationType.CityName,
    value: 'Kansas City',
    countryCode: 'US',
    displayName: 'KC',
  },
  fetchingForecast: false,
  forecastFetchError: null,
  unit: 'F', // TODO: move this to settings state
  currentForecast: {},
  futureForecast: {},
};

export default function weatherReducer(state: State = defaultState, action: WeatherAction): State {
  switch (action.type) {
  case Actions.FetchForecast:
    return { ...state,
      location: action.payload.location, unit: action.payload.unit,
      fetchingForecast: true, forecastFetchError: null,
    };
  case Actions.FetchForecastFailure:
    return { ...state,
      fetchingForecast: false, forecastFetchError: action.payload.error,
    };
  case Actions.ReceiveForecast:
    return { ...state,
      fetchingForecast: false,
      currentForecast: action.payload.current, futureForecast: action.payload.future,
    };
  default:
    return state;
  }
}
