import React from 'react';
import WeatherCard from '../../../weather/components/WeatherCard';
import { WeatherLocation } from '../../../weather/interface';

export interface WeatherCardPreviewProps {
  readonly futurePeriod: 'Tonight'|'Tomorrow';
  readonly apiKey: string;
  readonly location: WeatherLocation;
}

const WeatherCardPreview: React.FC<WeatherCardPreviewProps> = props => {
  const locationDisplay = props.location.displayName || props.location.value;

  return <WeatherCard futurePeriod={props.futurePeriod} location={locationDisplay.toString()} />;
};

export default WeatherCardPreview;
