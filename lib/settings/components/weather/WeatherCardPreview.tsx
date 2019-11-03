import React, { useState, useEffect, useContext } from 'react';
import { useDebouncedProps } from 'lib/hooks';
import * as Client from 'lib/weather/api';
import LocationEditorDispatch from './locationEditorDispatch';
import { Forecast } from 'lib/weather/interface';
import WeatherCard from 'lib/weather/components/WeatherCard';
import { WeatherLocation } from 'lib/weather/interface';

export interface WeatherCardPreviewProps {
  readonly futurePeriod: 'Tonight'|'Tomorrow';
  readonly unit: 'F'|'C';
  readonly location: WeatherLocation;
}

const WeatherCardPreview: React.FC<WeatherCardPreviewProps> = ({ location, unit, futurePeriod }) => {
  const dispatch = useContext(LocationEditorDispatch);

  const [ currentForecast, setCurrentForecast ] = useState<Forecast>({} as any);
  const [ futureForecast, setFutureForecast ] = useState<Forecast>({} as any);

  useEffect(() => {
    if (!location.value) {
      return;
    }

    dispatch({ type: 'forecastFetched' });
    Client.fetchForecasts(location, unit)
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
  }, [ unit, ...useDebouncedProps(750, location.type, location.countryCode, location.value, location.displayName) ]);

  const locationName = location.displayName ? location.displayName.toString() : undefined;

  return <WeatherCard
    futurePeriod={futurePeriod} location={locationName}
    currentWeatherType={currentForecast.condition} currentTemperature={currentForecast.temperature}
    futureWeatherType={futureForecast.condition} futureTemperature={futureForecast.temperature}
  />;
};

export default WeatherCardPreview;
