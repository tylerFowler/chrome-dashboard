import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useDebouncedProps } from 'lib/hooks';
import * as Client from 'lib/weather/api';
import LocationEditorDispatch from './locationEditorDispatch';
import { getWeatherUnits } from '../../selectors';
import { Forecast } from 'lib/weather/interface';
import WeatherCard from 'lib/weather/components/WeatherCard';
import { WeatherLocation } from 'lib/weather/interface';

export interface WeatherCardPreviewProps {
  readonly futurePeriod: 'Tonight'|'Tomorrow';
  readonly apiKey: string;
  readonly location: WeatherLocation;
}

const WeatherCardPreview: React.FC<WeatherCardPreviewProps> = ({ location, apiKey, futurePeriod }) => {
  const dispatch = useContext(LocationEditorDispatch);

  const weatherUnit = useSelector(getWeatherUnits);
  const [ currentForecast, setCurrentForecast ] = useState<Forecast>({} as any);
  const [ futureForecast, setFutureForecast ] = useState<Forecast>({} as any);

  useEffect(() => {
    if (!location.value) {
      return;
    }

    dispatch({ type: 'forecastFetched' });
    Client.fetchForecasts(location, apiKey, weatherUnit)
      .then(({ future, current, city }) => {
        dispatch({ type: 'forecastFetchSuccess' });

        setCurrentForecast(current);
        setFutureForecast(future);

        if (city) {
          dispatch({ type: 'updateDefaultDisplayName', payload: city.name });

          if (city.country) {
            if (location.countryCode && location.countryCode !== city.country) {
              dispatch({ type: 'setWarning', payload: `This forecast is for a country code of "${city.country}"` });
            } else {
              dispatch({ type: 'updateCountryCode', payload: city.country });
            }
          }
        }
      })
      .catch(error => dispatch({
        type: 'forecastFetchFailure',
        payload: `Failed to load weather forecast: ${error.message}`,
      }));
  }, [
    apiKey, weatherUnit,
    ...useDebouncedProps(750, location.type, location.countryCode, location.value, location.displayName),
  ]);

  return <WeatherCard
    futurePeriod={futurePeriod} location={location.displayName.toString() || undefined}
    currentWeatherType={currentForecast.condition} currentTemperature={currentForecast.temperature}
    futureWeatherType={futureForecast.condition} futureTemperature={futureForecast.temperature}
  />;
};

export default WeatherCardPreview;
