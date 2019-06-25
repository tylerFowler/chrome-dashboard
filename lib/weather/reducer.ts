import { Actions, WeatherAction } from './actions';
import { Forecast } from './interface';

export interface State {
  readonly currentForecast: Partial<Forecast>;
  readonly futureForecast: Partial<Forecast>;
  readonly fetchingForecast: boolean;
  readonly forecastFetchError: Error;
}

export const defaultState: State = {
  fetchingForecast: false,
  forecastFetchError: null,
  currentForecast: {},
  futureForecast: {},
};

export default function weatherReducer(state: State = defaultState, action: WeatherAction): State {
  switch (action.type) {
  case Actions.FetchForecast:
    return { ...state, fetchingForecast: true, forecastFetchError: null };
  case Actions.FetchForecastFailure:
    return { ...state,
      fetchingForecast: false, forecastFetchError: action.payload.error,
    };
  case Actions.ReceiveForecast:
    return { ...state, fetchingForecast: false,
      currentForecast: action.payload.current, futureForecast: action.payload.future,
    };
  default:
    return state;
  }
}
