import React, { useContext, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { WeatherLocationType, WeatherLocation } from '../interface';
import { refreshWeatherCoords } from 'lib/settings/actions';
import { WeatherSettingsContext } from 'lib/settings/context';
import { getWeatherLocationConfig, getWeatherLocationRefreshError } from 'lib/settings/selectors';
import { fetchForecast } from '../actions';
import WeatherCard from './WeatherCard';
import {
  getCurrentForecast, getRelativeFuturePeriod, getFutureForecast,
  getForecastFetchError, isFetchingForecast,
} from '../selectors';

const WeatherPanel: React.FC = () => {
  const dispatch = useDispatch();
  const weatherSettings = useContext(WeatherSettingsContext);

  const refineLocation = useCallback(() => { dispatch(refreshWeatherCoords()); }, [ dispatch ]);

  // must reload weather when the location descriptor (or presence thereof) or requested unit changes
  const weatherDeps = [ weatherSettings.location && weatherSettings.location.value, weatherSettings.unit ];

  const requestForecast = useCallback(() => {
    if (WeatherLocation.isValid(weatherSettings.location)) {
      dispatch(fetchForecast(weatherSettings.location, weatherSettings.unit));
    }
  }, [ dispatch, ...weatherDeps ]);

  useEffect(requestForecast, [ requestForecast, ...weatherDeps ]);

  const forecastFetchError = useSelector(getForecastFetchError);

  let locationRefreshError = useSelector(getWeatherLocationRefreshError);
  if (weatherSettings.location.type !== WeatherLocationType.Current) {
    locationRefreshError = null; // never show geolocation errors when not using the location type that uses it
  }

  return <WeatherCard
    location={useSelector(getWeatherLocationConfig).displayName || undefined}
    currentWeatherType={useSelector(getCurrentForecast).condition}
    currentTemperature={useSelector(getCurrentForecast).temperature}
    futurePeriod={getRelativeFuturePeriod()}
    futureWeatherType={useSelector(getFutureForecast).condition}
    futureTemperature={useSelector(getFutureForecast).temperature}
    forecastFetchError={forecastFetchError || locationRefreshError}
    isFetchingForecast={useSelector(isFetchingForecast)}
    refineLocation={weatherSettings.location.type === WeatherLocationType.Current && refineLocation}
  />;
};

export default WeatherPanel;
