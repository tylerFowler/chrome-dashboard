import { ActionType, action } from 'typesafe-actions';
import { WeatherLocation, Forecast } from './interface';

export enum Actions {
  FetchForecast = 'WEATHER_FETCH_FORECAST',
  FetchForecastFailure = 'WEATHER_FETCH_FORECAST_FAILURE',
  ReceiveForecast = 'WEATHER_RECV_FORECAST',
}

export type WeatherAction = ActionType<
  | typeof fetchForecast
  | typeof recvForecast
  | typeof fetchForecastError
>;

export const fetchForecast = (location: WeatherLocation, unit: 'F'|'C') =>
  action(Actions.FetchForecast, { location, unit });

export const recvForecast = (current: Forecast, future: Forecast) =>
  action(Actions.ReceiveForecast, { current, future });

export const fetchForecastError = (error: Error) =>
  action(Actions.FetchForecastFailure, { error });
