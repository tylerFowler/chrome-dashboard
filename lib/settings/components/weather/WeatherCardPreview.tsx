import React, { useState, useEffect, useContext } from 'react';
import LocationEditorDispatch from './locationEditorDispatch';
import * as Client from '../../../weather/api';
import { Forecast } from '../../../weather/interface';
import WeatherCard from '../../../weather/components/WeatherCard';
import { WeatherLocation } from '../../../weather/interface';
import { useDebouncedProps } from '../../../hooks';
import { Error as ErrorAlert } from '../../../styled/Alert';

export interface WeatherCardPreviewProps {
  readonly futurePeriod: 'Tonight'|'Tomorrow';
  readonly apiKey: string;
  readonly location: WeatherLocation;
}

const WeatherCardPreview: React.FC<WeatherCardPreviewProps> = ({ location, apiKey, futurePeriod }) => {
  const dispatch = useContext(LocationEditorDispatch);
  const locationDisplay = location.displayName || location.value;

  const [ currentForecast, setCurrentForecast ] = useState<Forecast>({} as any);
  const [ futureForecast, setFutureForecast ] = useState<Forecast>({} as any);
  const [ forecastFetchErr, setForecastFetchErr ] = useState<Error>(null);

  useEffect(() => {
    setForecastFetchErr(null);

    Client.fetchForecasts(location, apiKey, 'F')
      .then(({ future, current, city }) => {
        setCurrentForecast(current);
        setFutureForecast(future);

        if (city) {
          dispatch({ type: 'updateDefaultDisplayName', payload: city.name });

          // move this to a warning error otherwise it'll be really confusing
          if (city.country) {
            dispatch({ type: 'updateCountryCode', payload: city.country });
          }
        }
      })
      .catch(setForecastFetchErr);
  }, [ apiKey, ...useDebouncedProps(750, location) ]);

  return (<>
    {/* TODO: move this error to the location editor, via dispatch */}
    {forecastFetchErr &&
      <ErrorAlert style={{fontSize: '1rem', margin: '1rem auto'}}>
        Failed to load weather forecast: {forecastFetchErr.message}
      </ErrorAlert>
    }

    <WeatherCard
      futurePeriod={futurePeriod} location={locationDisplay.toString()}
      currentWeatherType={currentForecast.condition} currentTemperature={currentForecast.temperature}
      futureWeatherType={futureForecast.condition} futureTemperature={futureForecast.temperature}
    />
  </>);
};

export default WeatherCardPreview;
