import React, { useContext, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { WeatherSettingsContext } from '../../settings/context';
import { getWeatherLocationConfig } from '../../settings/selectors';
import { fetchForecast } from '../actions';
import WeatherCard from './WeatherCard';
import { getCurrentForecast, getRelativeFuturePeriod, getFutureForecast, getForecastFetchError } from '../selectors';
import { refreshWeatherCoords } from '../../settings/actions';

const WeatherPanel: React.FC = () => {
  const dispatch = useDispatch();
  const weatherSettings = useContext(WeatherSettingsContext);

  const refineLocation = useCallback(() => { dispatch(refreshWeatherCoords()); }, [ dispatch ]);

  // must reload weather when the location descriptor (or presence thereof) or requested unit changes
  const weatherDeps = [ weatherSettings.location && weatherSettings.location.value, weatherSettings.unit ];

  const requestForecast = useCallback(() => {
    dispatch(fetchForecast(weatherSettings.location, weatherSettings.unit));
  }, [ dispatch, ...weatherDeps ]);

  useEffect(requestForecast, [ requestForecast, ...weatherDeps ]);

  return <WeatherCard
    location={useSelector(getWeatherLocationConfig).displayName || undefined}
    currentWeatherType={useSelector(getCurrentForecast).condition}
    currentTemperature={useSelector(getCurrentForecast).temperature}
    futurePeriod={getRelativeFuturePeriod()}
    futureWeatherType={useSelector(getFutureForecast).condition}
    futureTemperature={useSelector(getFutureForecast).temperature}
    forecastFetchError={useSelector(getForecastFetchError)}
    refineLocation={refineLocation}
  />;
};

export default WeatherPanel;
