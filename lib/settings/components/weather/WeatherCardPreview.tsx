import React, { useState, useEffect } from 'react';
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

// TODO: need a way to pass the city name back up to parent so it can use it for
// a display name if none is specified - use dispatch
const WeatherCardPreview: React.FC<WeatherCardPreviewProps> = ({ location, apiKey, futurePeriod }) => {
  const locationDisplay = location.displayName || location.value;

  const [ currentForecast, setCurrentForecast ] = useState<Forecast>({} as any);
  const [ futureForecast, setFutureForecast ] = useState<Forecast>({} as any);
  const [ forecastFetchErr, setForecastFetchErr ] = useState<Error>(null);

  useEffect(() => {
    setForecastFetchErr(null);

    Client.fetchForecasts(location, apiKey, 'F')
      .then(({ future, current }) => {
        setCurrentForecast(current);
        setFutureForecast(future);
      })
      .catch(setForecastFetchErr);
  }, [ apiKey, ...useDebouncedProps(750, location) ]);

  return (<>
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
